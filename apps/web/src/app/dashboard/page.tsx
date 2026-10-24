'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  LogIn, 
  LogOut, 
  BedDouble, 
  CheckCircle2, 
  Clock, 
  Phone, 
  PlusCircle, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { formatUsd } from '@staypilot/shared-types';

export default function DashboardOverviewPage() {
  const [arrivals, setArrivals] = useState([
    {
      id: 'res-1',
      bookingReference: 'SP-2610-9012',
      guestName: 'Channary Seng',
      roomType: 'Khmer Traditional Suite',
      assignedRoom: '201',
      checkInDate: 'Today',
      checkOutDate: 'Oct 28',
      totalUsd: 22500,
      paymentStatus: 'Pending (Cash at Reception)',
      status: 'CONFIRMED',
    },
    {
      id: 'res-2',
      bookingReference: 'SP-2610-4491',
      guestName: 'Markus Weber',
      roomType: 'Deluxe Balcony King',
      assignedRoom: '102',
      checkInDate: 'Today',
      checkOutDate: 'Oct 27',
      totalUsd: 9000,
      paymentStatus: 'Paid (Bakong KHQR)',
      status: 'CONFIRMED',
    },
  ]);

  const [departures, setDepartures] = useState([
    {
      id: 'res-3',
      bookingReference: 'SP-2610-8421',
      guestName: 'David Laurent',
      roomType: 'Deluxe Balcony King',
      assignedRoom: '101',
      checkInDate: 'Oct 23',
      checkOutDate: 'Today',
      totalUsd: 9000,
      paymentStatus: 'Settled',
      status: 'CHECKED_IN',
    },
  ]);

  const handleCheckIn = (id: string) => {
    setArrivals((prev) => prev.filter((r) => r.id !== id));
    alert('Guest checked in successfully! Room status updated.');
  };

  const handleCheckOut = (id: string) => {
    setDepartures((prev) => prev.filter((r) => r.id !== id));
    alert('Guest checked out successfully! Room 101 marked DIRTY for housekeeping.');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-forest-900">Today at a Glance</h1>
          <p className="text-xs text-charcoal-500">
            Real-time front desk status for Angkor Pavilion Boutique Resort.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/calendar"
            className="px-4 py-2 bg-ivory-100 hover:bg-ivory-200 text-forest-900 border border-ivory-300 text-xs font-semibold rounded-xl transition"
          >
            Open Calendar Tape-Chart
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-hospitality p-5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Today's Arrivals</span>
            <div className="w-8 h-8 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center">
              <LogIn className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-forest-900">{arrivals.length}</span>
            <span className="text-xs text-charcoal-500 block mt-0.5">Expected check-ins</span>
          </div>
        </div>

        <div className="card-hospitality p-5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Today's Departures</span>
            <div className="w-8 h-8 rounded-lg bg-gold-50 text-gold-700 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-forest-900">{departures.length}</span>
            <span className="text-xs text-charcoal-500 block mt-0.5">Due for check-out</span>
          </div>
        </div>

        <div className="card-hospitality p-5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Currently In-House</span>
            <div className="w-8 h-8 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-forest-900">7</span>
            <span className="text-xs text-charcoal-500 block mt-0.5">Active staying guests</span>
          </div>
        </div>

        <div className="card-hospitality p-5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Occupancy Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-forest-900">78%</span>
            <span className="text-xs text-emerald-700 font-semibold block mt-0.5">7 of 9 rooms occupied</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Arrivals & Departures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Arrivals Table */}
        <div className="card-hospitality p-6 bg-white">
          <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
            <div>
              <h2 className="text-lg font-bold font-display text-forest-900">Today's Arrivals</h2>
              <span className="text-xs text-charcoal-500">Guests arriving today</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
              {arrivals.length} pending
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {arrivals.length === 0 ? (
              <p className="text-xs text-charcoal-500 py-6 text-center">No more arrivals remaining today.</p>
            ) : (
              arrivals.map((arr) => (
                <div
                  key={arr.id}
                  className="p-4 rounded-xl border border-ivory-200 bg-ivory-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-forest-900">{arr.guestName}</span>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-ivory-300 text-charcoal-600">
                        {arr.bookingReference}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1">
                      {arr.roomType} · <strong className="text-forest-800">Room {arr.assignedRoom}</strong>
                    </p>
                    <span className="text-[11px] text-charcoal-500 block mt-0.5">
                      {formatUsd(arr.totalUsd)} · {arr.paymentStatus}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCheckIn(arr.id)}
                    className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                    <span>Check In Guest</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Departures Table */}
        <div className="card-hospitality p-6 bg-white">
          <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
            <div>
              <h2 className="text-lg font-bold font-display text-forest-900">Today's Departures</h2>
              <span className="text-xs text-charcoal-500">Check-out deadline: 12:00 PM</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gold-100 text-gold-800">
              {departures.length} pending
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {departures.length === 0 ? (
              <p className="text-xs text-charcoal-500 py-6 text-center">All departed guests processed.</p>
            ) : (
              departures.map((dep) => (
                <div
                  key={dep.id}
                  className="p-4 rounded-xl border border-ivory-200 bg-ivory-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-forest-900">{dep.guestName}</span>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-ivory-300 text-charcoal-600">
                        {dep.bookingReference}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1">
                      {dep.roomType} · <strong className="text-forest-800">Room {dep.assignedRoom}</strong>
                    </p>
                    <span className="text-[11px] text-forest-700 font-semibold block mt-0.5">
                      Bill Settled ({formatUsd(dep.totalUsd)})
                    </span>
                  </div>

                  <button
                    onClick={() => handleCheckOut(dep.id)}
                    className="px-4 py-2 bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 border border-ivory-300 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5 text-forest-700" />
                    <span>Check Out</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
