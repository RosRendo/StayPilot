'use client';

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Filter, 
  Bed, 
  Users, 
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

const DATES = [
  { label: 'Oct 24', isToday: true },
  { label: 'Oct 25', isToday: false },
  { label: 'Oct 26', isToday: false },
  { label: 'Oct 27', isToday: false },
  { label: 'Oct 28', isToday: false },
  { label: 'Oct 29', isToday: false },
  { label: 'Oct 30', isToday: false },
];

const ROOM_ROWS = [
  {
    roomNumber: '101',
    category: 'Deluxe Balcony King',
    reservation: { guest: 'David Laurent', startCol: 0, spanCols: 2, status: 'CHECKED_IN', ref: 'SP-2610-8421' },
  },
  {
    roomNumber: '102',
    category: 'Deluxe Balcony King',
    reservation: { guest: 'Markus Weber', startCol: 0, spanCols: 3, status: 'CONFIRMED', ref: 'SP-2610-4491' },
  },
  {
    roomNumber: '103',
    category: 'Deluxe Balcony King',
    reservation: null,
  },
  {
    roomNumber: '104',
    category: 'Deluxe Balcony King',
    reservation: { guest: 'Sophie Chen', startCol: 2, spanCols: 3, status: 'CONFIRMED', ref: 'SP-2610-7712' },
  },
  {
    roomNumber: '201',
    category: 'Khmer Traditional Suite',
    reservation: { guest: 'Channary Seng', startCol: 0, spanCols: 4, status: 'CONFIRMED', ref: 'SP-2610-9012' },
  },
  {
    roomNumber: '202',
    category: 'Khmer Traditional Suite',
    reservation: null, // Room Dirty
  },
  {
    roomNumber: '203',
    category: 'Khmer Traditional Suite',
    reservation: { guest: 'Jean-Paul Martin', startCol: 1, spanCols: 4, status: 'CONFIRMED', ref: 'SP-2610-1120' },
  },
  {
    roomNumber: 'Villa 1',
    category: 'Frangipani Garden Villa',
    reservation: { guest: 'Alexander Wright', startCol: 0, spanCols: 5, status: 'CHECKED_IN', ref: 'SP-2610-3341' },
  },
  {
    roomNumber: 'Villa 2',
    category: 'Frangipani Garden Villa',
    reservation: null,
  },
];

export default function CalendarTapeChartPage() {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-forest-900">Reservation Tape-Chart</h1>
          <p className="text-xs text-charcoal-500">Visual timeline of physical room occupancy across dates.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-ivory-300 rounded-xl p-1 shadow-sm">
            <button className="p-1.5 hover:bg-ivory-100 rounded-lg text-charcoal-700">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-forest-900">October 2026</span>
            <button className="p-1.5 hover:bg-ivory-100 rounded-lg text-charcoal-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-charcoal-600 bg-white p-3 rounded-xl border border-ivory-200">
        <span className="font-semibold text-charcoal-800">Status:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-forest-800"></span> Checked In
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gold-500"></span> Confirmed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-ivory-200 border border-ivory-300"></span> Available
        </span>
      </div>

      {/* Tape Chart Grid */}
      <div className="card-hospitality bg-white overflow-x-auto shadow-sm">
        <div className="min-w-[800px]">
          {/* Header Row (Dates) */}
          <div className="grid grid-cols-8 border-b border-ivory-300 bg-ivory-100/70 text-xs font-bold text-forest-900">
            <div className="p-3.5 border-r border-ivory-300">Room</div>
            {DATES.map((date, idx) => (
              <div
                key={idx}
                className={`p-3.5 text-center border-r border-ivory-300 last:border-r-0 ${
                  date.isToday ? 'bg-forest-100/80 text-forest-900 font-extrabold' : ''
                }`}
              >
                <span>{date.label}</span>
                {date.isToday && (
                  <span className="block text-[9px] uppercase tracking-wider text-forest-700 font-bold">Today</span>
                )}
              </div>
            ))}
          </div>

          {/* Room Rows */}
          <div className="divide-y divide-ivory-200">
            {ROOM_ROWS.map((row, idx) => (
              <div key={idx} className="grid grid-cols-8 items-center text-xs min-h-[58px]">
                {/* Room Info */}
                <div className="p-3 border-r border-ivory-200 bg-ivory-50/50">
                  <span className="font-bold text-forest-900 block">Room {row.roomNumber}</span>
                  <span className="text-[10px] text-charcoal-500 block truncate">{row.category}</span>
                </div>

                {/* Days Grid Cells */}
                <div className="col-span-7 grid grid-cols-7 relative h-full items-center">
                  {/* Empty Background Grid Lines */}
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
                    <div
                      key={dayIdx}
                      className="h-full border-r border-ivory-100 last:border-r-0 hover:bg-ivory-50/40 transition"
                    ></div>
                  ))}

                  {/* Reservation Block Overlay */}
                  {row.reservation && (
                    <div
                      onClick={() => setSelectedBooking(row.reservation)}
                      style={{
                        gridColumnStart: row.reservation.startCol + 1,
                        gridColumnEnd: `span ${row.reservation.spanCols}`,
                      }}
                      className={`absolute inset-y-2 left-1 right-1 rounded-lg px-3 flex items-center justify-between cursor-pointer transition shadow-sm hover:brightness-105 ${
                        row.reservation.status === 'CHECKED_IN'
                          ? 'bg-forest-800 text-ivory-50'
                          : 'bg-gold-500 text-charcoal-900 font-semibold'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <span className="font-bold text-[11px] block truncate">{row.reservation.guest}</span>
                        <span className="text-[9px] opacity-80 block truncate">{row.reservation.ref}</span>
                      </div>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/20 font-bold">
                        {row.reservation.status === 'CHECKED_IN' ? 'In-House' : 'Confirmed'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Booking Modal / Detail Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-hospitality p-6 bg-white max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
              <h3 className="font-display font-bold text-lg text-forest-900">Reservation Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-charcoal-400 hover:text-charcoal-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-charcoal-700">
              <div>
                <span className="text-charcoal-500 block uppercase font-semibold">Guest Name</span>
                <span className="text-sm font-bold text-forest-900">{selectedBooking.guest}</span>
              </div>

              <div>
                <span className="text-charcoal-500 block uppercase font-semibold">Booking Reference</span>
                <span className="font-mono font-bold text-forest-800 text-sm">{selectedBooking.ref}</span>
              </div>

              <div>
                <span className="text-charcoal-500 block uppercase font-semibold">Status</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-forest-100 text-forest-800 font-bold">
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-ivory-200 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
