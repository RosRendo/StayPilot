import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting StayPilot database seed...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Superadmin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@staypilot.com' },
    update: {},
    create: {
      email: 'admin@staypilot.com',
      passwordHash,
      fullName: 'StayPilot Admin',
      platformRole: 'SUPERADMIN',
    },
  });

  // 2. Create Angkor Pavilion Owner
  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@angkorpavilion.com' },
    update: {},
    create: {
      email: 'owner@angkorpavilion.com',
      passwordHash,
      fullName: 'Sophea Pich',
      phoneNumber: '+855 12 889 977',
      platformRole: 'USER',
    },
  });

  // 3. Create Hotel: Angkor Pavilion Boutique
  const angkorPavilion = await prisma.hotel.upsert({
    where: { slug: 'angkor-pavilion' },
    update: {},
    create: {
      name: 'Angkor Pavilion Boutique',
      slug: 'angkor-pavilion',
      tagline: 'Quiet luxury and Khmer heritage nestled near the temples',
      descriptionEn:
        'A peaceful sanctuary of Khmer charm and refined tranquility located in Wat Bo Village, Siem Reap. Featuring handcrafted teakwood furnishings, a saltwater swimming pool framed by lush frangipani trees, and bespoke hospitality just 15 minutes from Angkor Wat.',
      descriptionKh:
        'រមណីយដ្ឋានបែបប្រណិតនៅភូមិវត្តបូព៌ ក្រុងសៀមរាប ក្បែរប្រាសាទអង្គរវត្ត។ មានគ្រឿងសង្ហារិមឈើប្រណិត អាងហែលទឹកធម្មជាតិ និងសួនផ្កាចំប៉ីដ៏ស្រស់បំព្រង។',
      coverImageUrl:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
      logoUrl:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
      galleryUrls: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      ],
      addressLine: 'Street 24, Wat Bo Village',
      city: 'Siem Reap',
      province: 'Siem Reap',
      country: 'Cambodia',
      postalCode: '17254',
      email: 'reservations@angkorpavilion.com',
      phone: '+855 63 963 888',
      telegramUsername: '@angkorpavilion',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      defaultCurrency: 'USD',
      usdToKhrRate: 4100,
      amenities: [
        'Saltwater Swimming Pool',
        'Free Airport Pickup',
        'High-Speed Wi-Fi',
        'Complimentary Khmer Breakfast',
        'Spa & Traditional Khmer Massage',
        '24/7 Front Desk Concierge',
        'Bicycle Rental',
      ],
      cancellationPolicy: 'Free cancellation up to 48 hours prior to arrival date.',
    },
  });

  // 4. Hotel Membership
  await prisma.hotelMembership.upsert({
    where: {
      userId_hotelId: {
        userId: ownerUser.id,
        hotelId: angkorPavilion.id,
      },
    },
    update: {},
    create: {
      userId: ownerUser.id,
      hotelId: angkorPavilion.id,
      role: 'OWNER',
    },
  });

  // 5. Subscription
  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + 14);
  await prisma.subscription.create({
    data: {
      hotelId: angkorPavilion.id,
      tier: 'PRO',
      status: 'ACTIVE',
      trialEndsAt: trialEnds,
      currentPeriodEnd: trialEnds,
      monthlyPriceInCents: 1900,
    },
  });

  // 6. Room Categories & Physical Rooms
  // Room Type 1: Deluxe Balcony King
  const deluxeKing = await prisma.roomType.upsert({
    where: {
      hotelId_slug: {
        hotelId: angkorPavilion.id,
        slug: 'deluxe-balcony-king',
      },
    },
    update: {},
    create: {
      hotelId: angkorPavilion.id,
      name: 'Deluxe Balcony King',
      slug: 'deluxe-balcony-king',
      descriptionEn: 'Spacious 38 sqm room with private garden-view balcony, king-sized bed, and rain shower.',
      descriptionKh: 'បន្ទប់ទំហំ ៣៨ ម៉ែត្រការ៉េ មានយ៉រមើលសួនច្បារ គ្រែធំស្តេច និងបន្ទប់ទឹកផ្កាឈូកទំនើប។',
      maxAdults: 2,
      maxChildren: 1,
      totalInventory: 4,
      bedConfiguration: '1 King Bed',
      roomSizeSqm: 38,
      basePriceInCents: 4500, // $45.00
      photos: [
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
      ],
      amenities: ['Private Balcony', 'Air Conditioning', 'Espresso Machine', 'Mini Bar', 'Safety Box'],
    },
  });

  for (const num of ['101', '102', '103', '104']) {
    await prisma.room.upsert({
      where: {
        hotelId_roomNumber: {
          hotelId: angkorPavilion.id,
          roomNumber: num,
        },
      },
      update: {},
      create: {
        hotelId: angkorPavilion.id,
        roomTypeId: deluxeKing.id,
        roomNumber: num,
        floor: 1,
        housekeeping: 'CLEAN',
      },
    });
  }

  // Room Type 2: Khmer Traditional Suite
  const khmerSuite = await prisma.roomType.upsert({
    where: {
      hotelId_slug: {
        hotelId: angkorPavilion.id,
        slug: 'khmer-traditional-suite',
      },
    },
    update: {},
    create: {
      hotelId: angkorPavilion.id,
      name: 'Khmer Traditional Suite',
      slug: 'khmer-traditional-suite',
      descriptionEn: 'Grand 55 sqm suite adorned with antique Cambodian silks, handcrafted teak wood, and terrazzo bathtub.',
      descriptionKh: 'បន្ទប់ឈុតធំទូលាយ ៥៥ ម៉ែត្រការ៉េ រចនាបែបប្រពៃណីខ្មែរ មានអាងត្រាំទឹកថ្មម៉ាប។',
      maxAdults: 3,
      maxChildren: 2,
      totalInventory: 3,
      bedConfiguration: '1 Super King + 1 Daybed',
      roomSizeSqm: 55,
      basePriceInCents: 7500, // $75.00
      photos: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
      ],
      amenities: ['Deep Soaking Tub', 'Pool View', 'Living Area', 'High-Speed Wi-Fi', 'Free Minibar'],
    },
  });

  for (const num of ['201', '202', '203']) {
    await prisma.room.upsert({
      where: {
        hotelId_roomNumber: {
          hotelId: angkorPavilion.id,
          roomNumber: num,
        },
      },
      update: {},
      create: {
        hotelId: angkorPavilion.id,
        roomTypeId: khmerSuite.id,
        roomNumber: num,
        floor: 2,
        housekeeping: num === '202' ? 'DIRTY' : 'CLEAN',
      },
    });
  }

  // Room Type 3: Frangipani Garden Villa
  const gardenVilla = await prisma.roomType.upsert({
    where: {
      hotelId_slug: {
        hotelId: angkorPavilion.id,
        slug: 'frangipani-garden-villa',
      },
    },
    update: {},
    create: {
      hotelId: angkorPavilion.id,
      name: 'Frangipani Garden Villa',
      slug: 'frangipani-garden-villa',
      descriptionEn: 'Standalone 75 sqm villa surrounded by tropical gardens with outdoor stone plunge bath.',
      descriptionKh: 'វីឡាដាច់ដោយឡែកទំហំ ៧៥ ម៉ែត្រការ៉េ ព័ទ្ធជុំវិញដោយសួនត្រូពិច និងអាងត្រាំទឹកថ្មធម្មជាតិ។',
      maxAdults: 4,
      maxChildren: 2,
      totalInventory: 2,
      bedConfiguration: '2 King Beds',
      roomSizeSqm: 75,
      basePriceInCents: 12000, // $120.00
      photos: [
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      ],
      amenities: ['Private Garden Patio', 'Outdoor Stone Bath', 'Butler Service', 'Pool Access'],
    },
  });

  for (const num of ['Villa 1', 'Villa 2']) {
    await prisma.room.upsert({
      where: {
        hotelId_roomNumber: {
          hotelId: angkorPavilion.id,
          roomNumber: num,
        },
      },
      update: {},
      create: {
        hotelId: angkorPavilion.id,
        roomTypeId: gardenVilla.id,
        roomNumber: num,
        floor: 1,
        housekeeping: 'CLEAN',
      },
    });
  }

  // 7. Seed Sample Guests & Initial Reservations
  const guest1 = await prisma.guest.create({
    data: {
      hotelId: angkorPavilion.id,
      fullName: 'David Laurent',
      email: 'david.laurent@example.com',
      phone: '+33 6 12 34 56 78',
      country: 'France',
      notes: 'Honeymoon couple. Prefers quiet upper floor with garden view.',
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkoutIn2Days = new Date(today);
  checkoutIn2Days.setDate(checkoutIn2Days.getDate() + 2);

  const room101 = await prisma.room.findFirst({
    where: { hotelId: angkorPavilion.id, roomNumber: '101' },
  });

  // Current In-House Reservation
  await prisma.reservation.create({
    data: {
      hotelId: angkorPavilion.id,
      guestId: guest1.id,
      bookingReference: 'SP-2610-8421',
      checkInDate: today,
      checkOutDate: checkoutIn2Days,
      adultsCount: 2,
      childrenCount: 0,
      status: 'CHECKED_IN',
      source: 'DIRECT_WEBSITE',
      subtotalInCents: 9000,
      taxInCents: 0,
      totalAmountInCents: 9000,
      currency: 'USD',
      specialRequests: 'Late arrival at 6 PM. Airport pickup requested.',
      reservedRooms: {
        create: {
          roomTypeId: deluxeKing.id,
          roomId: room101?.id,
          nightlyPriceInCents: 4500,
        },
      },
      payments: {
        create: {
          amountInCents: 9000,
          currency: 'USD',
          method: 'BANK_TRANSFER_KHQR',
          status: 'SETTLED',
          transactionRef: 'BAKONG-TX-998822',
          settledAt: new Date(),
        },
      },
    },
  });

  // Future Arrival Reservation
  const guest2 = await prisma.guest.create({
    data: {
      hotelId: angkorPavilion.id,
      fullName: 'Channary Seng',
      email: 'channary.seng@example.kh',
      phone: '+855 12 990 011',
      country: 'Cambodia',
      notes: 'VIP local guest from Phnom Penh.',
    },
  });

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkoutTomorrowPlus3 = new Date(tomorrow);
  checkoutTomorrowPlus3.setDate(checkoutTomorrowPlus3.getDate() + 3);

  await prisma.reservation.create({
    data: {
      hotelId: angkorPavilion.id,
      guestId: guest2.id,
      bookingReference: 'SP-2610-9012',
      checkInDate: tomorrow,
      checkOutDate: checkoutTomorrowPlus3,
      adultsCount: 2,
      childrenCount: 1,
      status: 'CONFIRMED',
      source: 'DIRECT_WEBSITE',
      subtotalInCents: 22500,
      taxInCents: 0,
      totalAmountInCents: 22500,
      currency: 'USD',
      specialRequests: 'Extra baby cot if possible.',
      reservedRooms: {
        create: {
          roomTypeId: khmerSuite.id,
          nightlyPriceInCents: 7500,
        },
      },
      payments: {
        create: {
          amountInCents: 22500,
          currency: 'USD',
          method: 'PAY_AT_HOTEL_CASH',
          status: 'PENDING',
          notes: 'Pay in USD or KHR at reception',
        },
      },
    },
  });

  console.log('✅ StayPilot database seeded successfully!');
  console.log(`🏨 Sample Hotel: "Angkor Pavilion Boutique" (Slug: angkor-pavilion)`);
  console.log(`👤 Owner Login: owner@angkorpavilion.com / Password123!`);
  console.log(`🛡️ Admin Login: admin@staypilot.com / Password123!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
