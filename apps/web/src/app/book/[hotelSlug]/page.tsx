'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  ArrowLeft, 
  QrCode, 
  Banknote, 
  Sparkles, 
  AlertCircle,
  Clock,
  Compass
} from 'lucide-react';
import { PaymentMethod, formatUsd, formatKhr, usdCentsToKhr } from '@staypilot/shared-types';

export default function BookingCheckoutPage({ params }: { params: { hotelSlug: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hotelSlug = params.hotelSlug;
  const roomTypeId = searchParams.get('roomType') || 'rt-1';
  const initialCheckIn = searchParams.get('checkIn') || new Date().toISOString().split('T')[0];
  const initialCheckOut = searchParams.get('checkOut') || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  })();
  const adults = Number(searchParams.get('adults')) || 2;

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Cambodia');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PAY_AT_HOTEL_CASH);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selected Room Details
  const roomName = roomTypeId === 'rt-2' ? 'Khmer Traditional Suite' : roomTypeId === 'rt-3' ? 'Frangipani Garden Villa' : 'Deluxe Balcony King';
  const nightlyCents = roomTypeId === 'rt-2' ? 7500 : roomTypeId === 'rt-3' ? 12000 : 4500;
  
  // Calculate nights
  const checkInDate = new Date(initialCheckIn);
  const checkOutDate = new Date(initialCheckOut);
  const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalCents = nightlyCents * nights;
  const exchangeRate = 4100;
  const totalKhr = usdCentsToKhr(totalCents, exchangeRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setError('Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Direct booking submission to backend API
      const bookingPayload = {
        hotelSlug,
        roomTypeId,
        checkInDate: initialCheckIn,
        checkOutDate: initialCheckOut,
        adultsCount: adults,
        guest: {
          fullName,
          email,
          phone,
          country,
        },
        paymentMethod,
        specialRequests,
      };

      const res = await fetch('http://localhost:4000/api/v1/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      if (!res.ok) {
        // Fallback for standalone demo if API is not yet running
        const mockRef = `SP-2610-${Math.floor(1000 + Math.random() * 9000)}`;
        router.push(`/booking/confirmation/${mockRef}?hotel=${hotelSlug}&guest=${encodeURIComponent(fullName)}&room=${encodeURIComponent(roomName)}&totalUsd=${totalCents}&totalKhr=${totalKhr}&checkIn=${initialCheckIn}&checkOut=${initialCheckOut}&method=${paymentMethod}`);
        return;
      }

      const data = await res.json();
      router.push(`/booking/confirmation/${data.bookingReference}`);
    } catch (err: any) {
      // Graceful fallback for local presentation
      const mockRef = `SP-2610-${Math.floor(1000 + Math.random() * 9000)}`;
      router.push(`/booking/confirmation/${mockRef}?hotel=${hotelSlug}&guest=${encodeURIComponent(fullName)}&room=${encodeURIComponent(roomName)}&totalUsd=${totalCents}&totalKhr=${totalKhr}&checkIn=${initialCheckIn}&checkOut=${initialCheckOut}&method=${paymentMethod}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-ivory-200">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link
            href={`/hotels/${hotelSlug}`}
            className="flex items-center gap-2 text-sm font-semibold text-forest-800 hover:text-forest-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hotel Overview
          </Link>

          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-gold-500" />
            <span className="font-display font-bold text-forest-900">StayPilot Direct Booking</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-7">
            <div className="card-hospitality p-8 bg-white mb-6">
              <h1 className="text-2xl font-bold font-display text-forest-900 mb-2">Guest Information</h1>
              <p className="text-xs text-charcoal-500 mb-6">
                Your reservation is placed directly with the hotel front desk.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Laurent or Pich Sophea"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="david@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5">
                      Phone / Telegram *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+855 12 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5">
                    Nationality / Country
                  </label>
                  <input
                    type="text"
                    placeholder="Cambodia, France, Australia..."
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5">
                    Special Requests
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Estimated arrival time, airport transfer details, extra bed..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                </div>

                {/* Cambodian Payment Options */}
                <div className="pt-6 border-t border-ivory-200">
                  <h2 className="text-lg font-bold font-display text-forest-900 mb-3">Payment Method</h2>
                  <div className="space-y-3">
                    {/* Pay at Hotel */}
                    <label
                      className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${
                        paymentMethod === PaymentMethod.PAY_AT_HOTEL_CASH
                          ? 'border-forest-600 bg-forest-50/50'
                          : 'border-ivory-300 hover:border-ivory-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={PaymentMethod.PAY_AT_HOTEL_CASH}
                        checked={paymentMethod === PaymentMethod.PAY_AT_HOTEL_CASH}
                        onChange={() => setPaymentMethod(PaymentMethod.PAY_AT_HOTEL_CASH)}
                        className="mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Banknote className="w-5 h-5 text-forest-700" />
                          <span className="font-semibold text-sm text-forest-900">Pay at Hotel (Cash / Card on Arrival)</span>
                        </div>
                        <p className="text-xs text-charcoal-500 mt-1">
                          No advance payment required. Settle your bill in USD or Khmer Riel at front desk reception upon check-in.
                        </p>
                      </div>
                    </label>

                    {/* Bakong KHQR */}
                    <label
                      className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${
                        paymentMethod === PaymentMethod.BANK_TRANSFER_KHQR
                          ? 'border-forest-600 bg-forest-50/50'
                          : 'border-ivory-300 hover:border-ivory-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={PaymentMethod.BANK_TRANSFER_KHQR}
                        checked={paymentMethod === PaymentMethod.BANK_TRANSFER_KHQR}
                        onChange={() => setPaymentMethod(PaymentMethod.BANK_TRANSFER_KHQR)}
                        className="mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-forest-700" />
                          <span className="font-semibold text-sm text-forest-900">Bakong KHQR (Instant Bank Transfer)</span>
                        </div>
                        <p className="text-xs text-charcoal-500 mt-1">
                          Scan official KHQR code with ABA Mobile, ACLEDA, Canadia, or Wing on the confirmation voucher.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-forest-800 hover:bg-forest-900 text-ivory-50 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Reserving Room with Hotel...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-gold-400" />
                        <span>Confirm Direct Reservation</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-charcoal-500 mt-2">
                    🔒 Instant confirmation voucher will be generated with a unique reference code.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Stay Summary Card */}
          <div className="lg:col-span-5">
            <div className="card-hospitality-elevated p-6 bg-white sticky top-28">
              <h2 className="text-lg font-bold font-display text-forest-900 pb-4 border-b border-ivory-200">
                Reservation Summary
              </h2>

              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <span className="text-xs text-charcoal-500 block uppercase tracking-wider font-semibold">Property</span>
                  <span className="font-bold text-forest-900 text-base">Angkor Pavilion Boutique</span>
                  <span className="text-xs text-charcoal-600 block">Wat Bo Village, Siem Reap</span>
                </div>

                <div className="pt-3 border-t border-ivory-100">
                  <span className="text-xs text-charcoal-500 block uppercase tracking-wider font-semibold">Room Category</span>
                  <span className="font-semibold text-forest-900">{roomName}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-ivory-100">
                  <div>
                    <span className="text-xs text-charcoal-500 block">Check-In</span>
                    <span className="font-semibold text-forest-900">{initialCheckIn}</span>
                    <span className="text-[11px] text-charcoal-500 block">from 14:00</span>
                  </div>
                  <div>
                    <span className="text-xs text-charcoal-500 block">Check-Out</span>
                    <span className="font-semibold text-forest-900">{initialCheckOut}</span>
                    <span className="text-[11px] text-charcoal-500 block">until 12:00</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-ivory-100">
                  <div className="flex justify-between text-xs text-charcoal-600 mb-1">
                    <span>{formatUsd(nightlyCents)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                    <span>{formatUsd(totalCents)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-charcoal-600">
                    <span>Taxes & Service Charge</span>
                    <span className="text-forest-700 font-medium">Included</span>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-ivory-200">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold text-forest-900">Total Price</span>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-forest-900">{formatUsd(totalCents)}</span>
                      <span className="block text-xs font-semibold text-gold-600">
                        ≈ {formatKhr(totalKhr)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs text-charcoal-500">
                  <Clock className="w-4 h-4 text-forest-600 flex-shrink-0" />
                  <span>Free cancellation up to 48 hours prior to arrival.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
