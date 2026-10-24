'use client';

import { useState } from 'react';
import { 
  BedDouble, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Wrench, 
  Filter, 
  Plus, 
  Eye,
  RefreshCw
} from 'lucide-react';
import { HousekeepingStatus } from '@staypilot/shared-types';

interface PhysicalRoom {
  id: string;
  roomNumber: string;
  category: string;
  floor: number;
  housekeeping: HousekeepingStatus;
  currentGuest?: string | null;
}

const INITIAL_ROOMS: PhysicalRoom[] = [
  { id: 'r1', roomNumber: '101', category: 'Deluxe Balcony King', floor: 1, housekeeping: HousekeepingStatus.CLEAN, currentGuest: 'David Laurent' },
  { id: 'r2', roomNumber: '102', category: 'Deluxe Balcony King', floor: 1, housekeeping: HousekeepingStatus.CLEAN, currentGuest: 'Markus Weber' },
  { id: 'r3', roomNumber: '103', category: 'Deluxe Balcony King', floor: 1, housekeeping: HousekeepingStatus.CLEAN, currentGuest: null },
  { id: 'r4', roomNumber: '104', category: 'Deluxe Balcony King', floor: 1, housekeeping: HousekeepingStatus.INSPECTED, currentGuest: null },
  { id: 'r5', roomNumber: '201', category: 'Khmer Traditional Suite', floor: 2, housekeeping: HousekeepingStatus.CLEAN, currentGuest: 'Channary Seng' },
  { id: 'r6', roomNumber: '202', category: 'Khmer Traditional Suite', floor: 2, housekeeping: HousekeepingStatus.DIRTY, currentGuest: null },
  { id: 'r7', roomNumber: '203', category: 'Khmer Traditional Suite', floor: 2, housekeeping: HousekeepingStatus.CLEAN, currentGuest: 'Jean-Paul Martin' },
  { id: 'r8', roomNumber: 'Villa 1', category: 'Frangipani Garden Villa', floor: 1, housekeeping: HousekeepingStatus.CLEAN, currentGuest: 'Alexander Wright' },
  { id: 'r9', roomNumber: 'Villa 2', category: 'Frangipani Garden Villa', floor: 1, housekeeping: HousekeepingStatus.INSPECTED, currentGuest: null },
];

export default function RoomsManagementPage() {
  const [rooms, setRooms] = useState<PhysicalRoom[]>(INITIAL_ROOMS);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const updateStatus = (id: string, newStatus: HousekeepingStatus) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, housekeeping: newStatus } : r)),
    );
  };

  const filteredRooms = filterStatus === 'ALL'
    ? rooms
    : rooms.filter((r) => r.housekeeping === filterStatus);

  const cleanCount = rooms.filter((r) => r.housekeeping === HousekeepingStatus.CLEAN || r.housekeeping === HousekeepingStatus.INSPECTED).length;
  const dirtyCount = rooms.filter((r) => r.housekeeping === HousekeepingStatus.DIRTY).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-forest-900">Rooms & Housekeeping</h1>
          <p className="text-xs text-charcoal-500">Live inventory and room turnover status for Angkor Pavilion.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              {cleanCount} Clean / Ready
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              {dirtyCount} Dirty / In-Progress
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
        {['ALL', HousekeepingStatus.CLEAN, HousekeepingStatus.DIRTY, HousekeepingStatus.INSPECTED].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-2 rounded-xl transition ${
              filterStatus === st
                ? 'bg-forest-800 text-ivory-50 shadow-sm'
                : 'bg-white text-charcoal-700 border border-ivory-300 hover:bg-ivory-100'
            }`}
          >
            {st === 'ALL' ? 'All Rooms (9)' : st}
          </button>
        ))}
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const isOccupied = !!room.currentGuest;

          return (
            <div
              key={room.id}
              className={`card-hospitality p-6 bg-white transition hover:shadow-md border-2 ${
                room.housekeeping === HousekeepingStatus.DIRTY
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-ivory-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-2xl font-bold font-display text-forest-900">
                    Room {room.roomNumber}
                  </span>
                  <span className="text-xs text-charcoal-500 block">{room.category} · Floor {room.floor}</span>
                </div>

                {/* Status Badge */}
                <div>
                  {room.housekeeping === HousekeepingStatus.CLEAN && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Clean
                    </span>
                  )}
                  {room.housekeeping === HousekeepingStatus.DIRTY && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Needs Cleaning
                    </span>
                  )}
                  {room.housekeeping === HousekeepingStatus.INSPECTED && (
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Inspected
                    </span>
                  )}
                </div>
              </div>

              {/* Occupancy details */}
              <div className="mt-4 pt-4 border-t border-ivory-100">
                <span className="text-[10px] uppercase tracking-wider text-charcoal-400 font-bold block mb-1">
                  Current Occupant
                </span>
                {isOccupied ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse"></span>
                    <span className="text-xs font-bold text-forest-900">{room.currentGuest}</span>
                  </div>
                ) : (
                  <span className="text-xs text-charcoal-400 italic">Vacant</span>
                )}
              </div>

              {/* Housekeeping Action Buttons */}
              <div className="mt-6 pt-4 border-t border-ivory-100 flex items-center gap-2">
                {room.housekeeping === HousekeepingStatus.DIRTY ? (
                  <button
                    onClick={() => updateStatus(room.id, HousekeepingStatus.CLEAN)}
                    className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Mark Clean
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(room.id, HousekeepingStatus.DIRTY)}
                    className="flex-1 py-2 bg-ivory-100 hover:bg-amber-100 text-charcoal-800 rounded-lg text-xs font-semibold transition border border-ivory-300 flex items-center justify-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    Mark Dirty
                  </button>
                )}

                <button
                  onClick={() => updateStatus(room.id, HousekeepingStatus.INSPECTED)}
                  className="px-3 py-2 bg-ivory-100 hover:bg-blue-50 text-charcoal-700 rounded-lg text-xs font-semibold transition border border-ivory-300"
                  title="Supervisor Inspected"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
