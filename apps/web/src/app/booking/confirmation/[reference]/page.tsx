'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Printer, 
  MapPin, 
  Phone, 
  Mail, 
  QrCode, 
  Calendar, 
  Hotel, 
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { formatUsd, formatKhr } from '@staypilot/shared-types';

export default function BookingConfirmationPage({ params }: { params: { reference: string } }) {
  const searchParams = useSearchParams();

  const reference = params.reference;
  const guestName = searchParams.get('guest') || 'David Laurent';
  const roomName = searchParams.get('room') || 'Deluxe Balcony King';
  const totalUsd = Number(searchParams.get('totalUsd')) || 9000;
  const totalKhr = Number(searchParams.get('totalKhr')) || 369000;
  const checkIn = searchParams.get('checkIn') || '2026-10-25';
  const checkOut = searchParams.get('checkOut') || '2026-10-27';
  const method = searchParams.get('method') || 'PAY_AT_HOTEL_CASH';

  return (
    <div className="min-h-screen bg-ivory-50 pb-24">
      {/* Printable Voucher Actions Header */}
      <header className="bg-white border-b border-ivory-200 print:hidden">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-gold-500" />
            <span className="font-display font-bold text-forest-900">StayPilot Voucher</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-ivory-100 hover:bg-ivory-200 text-forest-900 text-xs font-semibold rounded-lg border border-ivory-300 flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              Print Voucher
            </button>
            <Link
              href="/hotels/angkor-pavilion"
              className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-semibold rounded-lg shadow-sm transition"
            >
              Back to Hotel
            </Link>
          </div>
        </div>
      </header>

      {/* Main Confirmation Content */}
      <main className="max-w-3xl mx-auto px-4 pt-10">
        <div className="card-hospitality p-8 sm:p-12 bg-white border border-ivory-300 shadow-md">
          {/* Header Status */}
          <div className="text-center pb-8 border-b border-ivory-200">
            <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto mb-4 border border-forest-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
              Direct Reservation Confirmed
            </span>

            <h1 className="text-3xl font-bold font-display text-forest-900 mt-3">
              Thank You, {guestName}!
            </h1>
            <p className="text-sm text-charcoal-600 mt-1">
              Your room reservation is securely recorded in the hotel system.
            </p>

            <div className="mt-6 inline-block bg-ivory-100 px-6 py-3 rounded-xl border border-ivory-300">
              <span className="text-xs uppercase tracking-wider text-charcoal-500 block font-semibold">Booking Reference</span>
              <span className="text-2xl font-mono font-bold text-forest-900 tracking-wider">{reference}</span>
            </div>
          </div>

          {/* Hotel & Stay Details */}
          <div className="py-8 border-b border-ivory-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold block mb-1">Hotel Details</span>
              <h2 className="text-lg font-bold text-forest-900">Angkor Pavilion Boutique</h2>
              <div className="text-xs text-charcoal-600 mt-2 space-y-1">
                <p className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-forest-700" /> Street 24, Wat Bo Village, Siem Reap</p>
                <p className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-forest-700" /> +855 63 963 888</p>
                <p className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-forest-700" /> reservations@angkorpavilion.com</p>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold block mb-1">Stay Details</span>
              <p className="text-sm font-bold text-forest-900">{roomName}</p>
              <div className="mt-2 text-xs text-charcoal-700 space-y-1">
                <p><span className="font-semibold">Check-In:</span> {checkIn} (from 14:00)</p>
                <p><span className="font-semibold">Check-Out:</span> {checkOut} (until 12:00)</p>
                <p><span className="font-semibold">Breakfast:</span> Included (Khmer & Continental)</p>
              </div>
            </div>
          </div>

          {/* Pricing & Settlement */}
          <div className="py-8 border-b border-ivory-200">
            <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold block mb-3">Financial Settlement</span>
            <div className="flex justify-between items-baseline bg-ivory-50 p-4 rounded-xl border border-ivory-200">
              <div>
                <span className="text-xs text-charcoal-500 block">Total Due</span>
                <span className="text-2xl font-bold text-forest-900">{formatUsd(totalUsd)}</span>
                <span className="text-xs font-semibold text-gold-600 block mt-0.5">
                  ≈ {formatKhr(totalKhr)} (USD 1 = 4,100 KHR)
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-charcoal-500 block">Payment Choice</span>
                <span className="text-xs font-bold text-forest-800 bg-white px-2.5 py-1 rounded-md border border-ivory-300">
                  {method === 'BANK_TRANSFER_KHQR' ? 'Bakong KHQR' : 'Pay at Reception (Cash/Card)'}
                </span>
              </div>
            </div>

            {/* If KHQR selected, display authentic QR bill */}
            {method === 'BANK_TRANSFER_KHQR' && (
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-200 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-36 h-36 bg-white p-3 rounded-xl border-2 border-red-500 shadow-sm flex items-center justify-center">
                  {/* Visual KHQR Representation */}
                  <div className="text-center">
                    <QrCode className="w-24 h-24 text-red-600 mx-auto" />
                    <span className="text-[10px] font-bold text-red-700 tracking-wider uppercase block -mt-1">KHQR</span>
                  </div>
                </div>

                <div className="text-left text-xs text-charcoal-700 space-y-1">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-[10px] uppercase">
                    Official Bakong KHQR
                  </span>
                  <p className="font-bold text-sm text-forest-900 pt-1">Angkor Pavilion Boutique Resort</p>
                  <p className="text-charcoal-600">Scan with any Cambodian Banking App (ABA, ACLEDA, Canadia, Wing, Sathapana).</p>
                  <p className="text-[11px] font-mono text-charcoal-500">Ref: {reference}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Voucher note */}
          <div className="pt-6 text-center text-xs text-charcoal-500">
            <p>Please present this confirmation voucher or reference code at the reception desk upon check-in.</p>
            <p className="mt-1">Need help? Message the hotel on Telegram: <strong className="text-forest-800">@angkorpavilion</strong></p>
          </div>
        </div>
      </main>
    </div>
  );
}
