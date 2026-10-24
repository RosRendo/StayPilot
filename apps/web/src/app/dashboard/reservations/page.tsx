'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  LogOut, 
  Clock, 
  Bed, 
  X,
  CreditCard,
  User,
  Phone
} from 'lucide-react';
import { ReservationStatus, BookingSource, formatUsd } from '@staypilot/shared-types';

interface ReservationItem {
  id: string;
  reference: string;
  guestName: string;
  phone: string;
  roomType: string;
  assignedRoom: string;
  checkIn: string;
  checkOut: string;
  totalUsd: number;
  status: ReservationStatus;
  source: BookingSource;
}

const INITIAL_RESERVATIONS: ReservationItem[] = [
  {
    id: 'res-1',
    reference: 'SP-2610-8421',
    guestName: 'David Laurent',
    phone: '+33 6 12 34 56 78',
    roomType: 'Deluxe Balcony King',
    assignedRoom: '101',
    checkIn: '2026-10-23',
    checkOut: '2026-10-25',
    totalUsd: 9000,
    status: ReservationStatus.CHECKED_IN,
    source: BookingSource.DIRECT_WEBSITE,
  },
  {
    id: 'res-2',
    reference: 'SP-2610-9012',
    guestName: 'Channary Seng',
    phone: '+855 12 990 011',
    roomType: 'Khmer Traditional Suite',
    assignedRoom: '201',
    checkIn: '2026-10-25',
    checkOut: '2026-10-28',
    totalUsd: 22500,
    status: ReservationStatus.CONFIRMED,
    source: BookingSource.DIRECT_WEBSITE,
  },
  {
    id: 'res-3',
    reference: 'SP-2610-4491',
    guestName: 'Markus Weber',
    phone: '+49 17 01 23 45 67',
    roomType: 'Deluxe Balcony King',
    assignedRoom: '102',
    checkIn: '2026-10-25',
    checkOut: '2026-10-27',
    totalUsd: 9000,
    status: ReservationStatus.CONFIRMED,
    source: BookingSource.FRONT_DESK,
  },
  {
    id: 'res-4',
    reference: 'SP-2610-3341',
    guestName: 'Alexander Wright',
    phone: '+44 77 00 90 01 23',
    roomType: 'Frangipani Garden Villa',
    assignedRoom: 'Villa 1',
    checkIn: '2026-10-24',
    checkOut: '2026-10-29',
    totalUsd: 60000,
    status: ReservationStatus.CHECKED_IN,
    source: BookingSource.DIRECT_WEBSITE,
  },
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>(INITIAL_RESERVATIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Reservation Form State
  const [newGuest, setNewGuest] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRoomType, setNewRoomType] = useState('Deluxe Balcony King');
  const [newRoomNumber, setNewRoomNumber] = useState('103');
  const [newCheckIn, setNewCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [newCheckOut, setNewCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [newPrice, setNewPrice] = useState('45');

  const filtered = reservations.filter((r) => {
    const matchSearch =
      r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.reference.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search);
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = `SP-2610-${Math.floor(1000 + Math.random() * 9000)}`;
    const nights = 2;
    const newItem: ReservationItem = {
      id: `res-${Date.now()}`,
      reference: newRef,
      guestName: newGuest,
      phone: newPhone,
      roomType: newRoomType,
      assignedRoom: newRoomNumber,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      totalUsd: Number(newPrice) * 100 * nights,
      status: ReservationStatus.CONFIRMED,
      source: BookingSource.WALK_IN,
    };

    setReservations([newItem, ...reservations]);
    setIsModalOpen(false);
    setNewGuest('');
    setNewPhone('');
    alert(`Walk-in reservation ${newRef} created successfully!`);
  };

  const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-forest-900">Reservations Directory</h1>
          <p className="text-xs text-charcoal-500">Search and manage all direct bookings and walk-ins.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Create Walk-In Booking</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by guest name, phone, or reference (e.g. SP-2610)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-ivory-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-700 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN, ReservationStatus.CHECKED_OUT].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-forest-800 text-ivory-50'
                  : 'bg-white text-charcoal-600 border border-ivory-300 hover:bg-ivory-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="card-hospitality bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100/70 border-b border-ivory-200 text-charcoal-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Room & Number</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-ivory-50/50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-forest-900">{res.reference}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-charcoal-900 block">{res.guestName}</span>
                    <span className="text-[10px] text-charcoal-500">{res.phone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-charcoal-800 block">{res.roomType}</span>
                    <span className="text-[11px] font-bold text-forest-800">Room {res.assignedRoom}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span>{res.checkIn} ➔ {res.checkOut}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-charcoal-900">
                    {formatUsd(res.totalUsd)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] uppercase font-bold text-charcoal-500 bg-ivory-100 px-2 py-0.5 rounded border border-ivory-200">
                      {res.source.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {res.status === ReservationStatus.CHECKED_IN && (
                      <span className="px-2.5 py-1 rounded-full bg-forest-100 text-forest-800 font-bold text-[10px]">
                        In-House
                      </span>
                    )}
                    {res.status === ReservationStatus.CONFIRMED && (
                      <span className="px-2.5 py-1 rounded-full bg-gold-100 text-gold-800 font-bold text-[10px]">
                        Confirmed
                      </span>
                    )}
                    {res.status === ReservationStatus.CHECKED_OUT && (
                      <span className="px-2.5 py-1 rounded-full bg-charcoal-100 text-charcoal-600 font-bold text-[10px]">
                        Departed
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {res.status === ReservationStatus.CONFIRMED && (
                      <button
                        onClick={() => handleStatusChange(res.id, ReservationStatus.CHECKED_IN)}
                        className="px-2.5 py-1 bg-forest-800 hover:bg-forest-900 text-ivory-50 rounded text-[11px] font-semibold"
                      >
                        Check In
                      </button>
                    )}
                    {res.status === ReservationStatus.CHECKED_IN && (
                      <button
                        onClick={() => handleStatusChange(res.id, ReservationStatus.CHECKED_OUT)}
                        className="px-2.5 py-1 bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 border border-ivory-300 rounded text-[11px] font-semibold"
                      >
                        Check Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Walk-in Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-hospitality p-6 sm:p-8 bg-white max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
              <h3 className="font-display font-bold text-xl text-forest-900">New Walk-In Reservation</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-charcoal-600 mb-1">Guest Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sokha Vanna"
                  value={newGuest}
                  onChange={(e) => setNewGuest(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-charcoal-600 mb-1">Phone / Telegram *</label>
                <input
                  type="tel"
                  required
                  placeholder="+855 12 000 111"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal-600 mb-1">Room Category</label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs"
                  >
                    <option value="Deluxe Balcony King">Deluxe Balcony King</option>
                    <option value="Khmer Traditional Suite">Khmer Traditional Suite</option>
                    <option value="Frangipani Garden Villa">Frangipani Garden Villa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal-600 mb-1">Assign Physical Room</label>
                  <select
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs"
                  >
                    <option value="103">Room 103 (Clean)</option>
                    <option value="104">Room 104 (Inspected)</option>
                    <option value="Villa 2">Villa 2 (Ready)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal-600 mb-1">Check-In Date</label>
                  <input
                    type="date"
                    value={newCheckIn}
                    onChange={(e) => setNewCheckIn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-charcoal-600 mb-1">Check-Out Date</label>
                  <input
                    type="date"
                    value={newCheckOut}
                    onChange={(e) => setNewCheckOut(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-charcoal-600 mb-1">Nightly Price ($ USD)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-50 border border-ivory-300 text-xs font-bold"
                />
              </div>

              <div className="pt-4 border-t border-ivory-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest-800 hover:bg-forest-900 text-ivory-50 rounded-lg text-xs font-semibold shadow"
                >
                  Confirm Walk-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
