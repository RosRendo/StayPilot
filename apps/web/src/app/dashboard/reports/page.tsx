'use client';

import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Hotel, 
  ArrowUpRight, 
  Sparkles,
  PieChart,
  Users
} from 'lucide-react';
import { formatUsd, formatKhr, usdCentsToKhr } from '@staypilot/shared-types';

export default function ReportsPage() {
  const totalRevenueCents = 428000; // $4,280.00
  const khrExchangeRate = 4100;
  const totalRevenueKhr = usdCentsToKhr(totalRevenueCents, khrExchangeRate);
  const totalNights = 78;
  const adrCents = Math.round(totalRevenueCents / totalNights); // $54.87
  const revParCents = Math.round(totalRevenueCents / (9 * 30)); // $15.85 across 9 rooms

  const sources = [
    { label: 'Direct Hotel Website', percentage: 68, color: 'bg-forest-800', bookings: 34, revenueUsd: 2910 },
    { label: 'Front-Desk Walk-In', percentage: 22, color: 'bg-gold-500', bookings: 11, revenueUsd: 941 },
    { label: 'Telegram & Direct Phone', percentage: 10, color: 'bg-forest-400', bookings: 5, revenueUsd: 429 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-forest-900">Revenue & Operations Reports</h1>
          <p className="text-xs text-charcoal-500">October 2026 performance for Angkor Pavilion Boutique Resort.</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold-50 border border-gold-200 text-gold-800 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-gold-600" />
          Direct Revenue: 0% OTA Fees Paid
        </div>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-hospitality p-6 bg-white">
          <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold block">Total Revenue</span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-forest-900">{formatUsd(totalRevenueCents)}</span>
            <span className="text-xs font-semibold text-gold-600 block mt-1">
              ≈ {formatKhr(totalRevenueKhr)}
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> +24% vs last month
          </span>
        </div>

        <div className="card-hospitality p-6 bg-white">
          <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold block">Average Daily Rate (ADR)</span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-forest-900">{formatUsd(adrCents)}</span>
            <span className="text-xs text-charcoal-500 block mt-1">
              per occupied room / night
            </span>
          </div>
          <span className="text-[11px] text-charcoal-500 block mt-2">
            Highest yield: Frangipani Villa
          </span>
        </div>

        <div className="card-hospitality p-6 bg-white">
          <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold block">RevPAR</span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-forest-900">{formatUsd(revParCents)}</span>
            <span className="text-xs text-charcoal-500 block mt-1">
              revenue per available room
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> Strong shoulder season
          </span>
        </div>

        <div className="card-hospitality p-6 bg-white">
          <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold block">Total Room Nights Sold</span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-forest-900">{totalNights}</span>
            <span className="text-xs text-charcoal-500 block mt-1">
              nights across 9 total rooms
            </span>
          </div>
          <span className="text-[11px] text-charcoal-600 font-semibold block mt-2">
            Avg length of stay: 2.8 nights
          </span>
        </div>
      </div>

      {/* Booking Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 card-hospitality p-6 bg-white">
          <h2 className="text-lg font-bold font-display text-forest-900 mb-2">Bookings by Acquisition Channel</h2>
          <p className="text-xs text-charcoal-500 mb-6">Showing how guests discovered and reserved your hotel.</p>

          {/* Progress bar visual */}
          <div className="h-4 rounded-full overflow-hidden flex bg-ivory-100 mb-6">
            {sources.map((s, idx) => (
              <div
                key={idx}
                style={{ width: `${s.percentage}%` }}
                className={`${s.color} transition-all duration-500`}
                title={`${s.label}: ${s.percentage}%`}
              ></div>
            ))}
          </div>

          <div className="space-y-4">
            {sources.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-ivory-200 bg-ivory-50/50">
                <div className="flex items-center gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full ${s.color}`}></span>
                  <div>
                    <span className="font-bold text-xs text-forest-900 block">{s.label}</span>
                    <span className="text-[11px] text-charcoal-500">{s.bookings} reservations</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-forest-900">${s.revenueUsd.toLocaleString()}</span>
                  <span className="text-[11px] font-semibold text-charcoal-500 block">{s.percentage}% of total</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Savings Highlight */}
        <div className="lg:col-span-5 card-hospitality-elevated p-6 bg-white border border-forest-200 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-forest-800" />
            </div>
            <h3 className="text-xl font-bold font-display text-forest-900 mb-2">OTA Commission Savings</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              If these 50 reservations were booked through major OTAs charging an average 18% commission fee:
            </p>

            <div className="mt-6 p-4 rounded-xl bg-forest-50 border border-forest-200 text-forest-900">
              <span className="text-xs uppercase tracking-wider text-forest-700 font-semibold block">You Saved This Month</span>
              <span className="text-3xl font-extrabold text-forest-900 block mt-1">
                ${Math.round(totalRevenueCents * 0.0018).toLocaleString()} USD
              </span>
              <span className="text-xs text-forest-700 mt-1 block">
                StayPilot subscription cost: $19/mo (ROI: 40×)
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-ivory-200 text-xs text-charcoal-500">
            Keep growing direct bookings with your shareable website link and local Bakong KHQR QR scans.
          </div>
        </div>
      </div>
    </div>
  );
}
