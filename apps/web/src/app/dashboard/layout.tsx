'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpenCheck, 
  BedDouble, 
  BarChart3, 
  Settings, 
  Hotel, 
  PlusCircle, 
  LogOut, 
  Sparkles,
  Compass,
  Bell,
  Menu,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { name: "Today's Overview", href: '/dashboard', icon: LayoutDashboard },
  { name: 'Reservations', href: '/dashboard/reservations', icon: BookOpenCheck },
  { name: 'Calendar Tape-Chart', href: '/dashboard/calendar', icon: CalendarDays },
  { name: 'Rooms & Housekeeping', href: '/dashboard/rooms', icon: BedDouble },
  { name: 'Reports & Revenue', href: '/dashboard/reports', icon: BarChart3 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ivory-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-forest-900 text-ivory-100 border-r border-forest-800 flex-shrink-0">
        {/* Hotel Identity */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-forest-800">
          <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-gold-400 font-bold border border-forest-700">
            <Compass className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <span className="font-display font-bold text-sm text-ivory-50 block truncate">
              Angkor Pavilion
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-400 block">
              Pro Plan · Siem Reap
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-forest-800 text-gold-400 font-semibold shadow-inner'
                    : 'text-ivory-300 hover:text-ivory-50 hover:bg-forest-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-ivory-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Public Hotel Link & User Profile */}
        <div className="p-4 border-t border-forest-800">
          <Link
            href="/hotels/angkor-pavilion"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-ivory-100 text-xs font-semibold transition border border-forest-700"
          >
            <Hotel className="w-4 h-4 text-gold-400" />
            <span>Open Public Website</span>
          </Link>

          <div className="mt-4 pt-4 border-t border-forest-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center text-xs font-bold text-gold-300">
                SP
              </div>
              <div>
                <span className="text-xs font-bold text-ivory-100 block">Sophea Pich</span>
                <span className="text-[10px] text-ivory-400 block">Property Owner</span>
              </div>
            </div>

            <Link href="/" className="text-ivory-400 hover:text-ivory-100 transition p-1">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-ivory-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-charcoal-700 hover:bg-ivory-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/reservations"
              className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-ivory-50 text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-gold-400" />
              <span>New Walk-In Booking</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
