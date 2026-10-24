import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { HotelRole, SubscriptionTier } from '@staypilot/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerOwner(dto: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    hotelName: string;
    city: string;
    addressLine: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException('An account with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const slug = dto.hotelName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `hotel-${Date.now()}`;

    // Transaction to create owner, hotel, membership, and initial trial subscription
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email.toLowerCase().trim(),
          passwordHash,
          fullName: dto.fullName,
          phoneNumber: dto.phoneNumber,
        },
      });

      const hotel = await tx.hotel.create({
        data: {
          name: dto.hotelName,
          slug,
          city: dto.city,
          addressLine: dto.addressLine,
          email: dto.email.toLowerCase().trim(),
          phone: dto.phoneNumber || '+855 12 345 678',
        },
      });

      const membership = await tx.hotelMembership.create({
        data: {
          userId: user.id,
          hotelId: hotel.id,
          role: HotelRole.OWNER,
        },
      });

      // 14-day free trial subscription
      const trialEnds = new Date();
      trialEnds.setDate(trialEnds.getDate() + 14);

      await tx.subscription.create({
        data: {
          hotelId: hotel.id,
          tier: SubscriptionTier.PRO,
          trialEndsAt: trialEnds,
          currentPeriodEnd: trialEnds,
          monthlyPriceInCents: 1900,
        },
      });

      return { user, hotel, membership };
    });

    const token = this.generateToken(result.user);

    return {
      accessToken: token,
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
        platformRole: result.user.platformRole,
        activeHotelId: result.hotel.id,
        activeRole: HotelRole.OWNER,
        hotel: result.hotel,
      },
    };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: {
        memberships: {
          include: {
            hotel: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account has been disabled');
    }

    const token = this.generateToken(user);
    const primaryMembership = user.memberships[0];

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        platformRole: user.platformRole,
        activeHotelId: primaryMembership?.hotelId,
        activeRole: primaryMembership?.role,
        hotel: primaryMembership?.hotel,
      },
    };
  }

  private generateToken(user: { id: string; email: string; platformRole: string }) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      platformRole: user.platformRole,
    });
  }
}
