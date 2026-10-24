import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  CalendarDays, 
  CreditCard, 
  Languages, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Hotel,
  TrendingUp,
  Clock,
  Compass
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-ivory-50/90 border-b border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-ivory-50 shadow-md">
              <Compass className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <span className="text-2xl font-bold font-display tracking-tight text-forest-900">StayPilot</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-gold-100 text-gold-800 rounded-full border border-gold-200">Cambodia</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-charcoal-600">
            <a href="#features" className="hover:text-forest-800 transition">Features</a>
            <a href="#pricing" className="hover:text-forest-800 transition">Pricing</a>
            <Link href="/hotels/angkor-pavilion" className="text-forest-700 font-semibold hover:text-forest-900 transition flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-500" />
              Live Hotel Demo
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="px-4 py-2 text-sm font-semibold text-forest-800 hover:text-forest-900 hover:bg-ivory-100 rounded-lg transition"
            >
              Hotel Login
            </Link>
            <Link
              href="/hotels/angkor-pavilion"
              className="px-5 py-2.5 text-sm font-semibold bg-forest-800 text-ivory-50 hover:bg-forest-900 rounded-xl shadow-sm hover:shadow transition flex items-center gap-2"
            >
              Guest Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse"></span>
                Built for Independent Boutique Hotels & Guesthouses
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-forest-900 leading-[1.15]">
                Direct Bookings for Cambodia Hotels. <br />
                <span className="text-gold-500 italic font-serif">Zero OTA Commissions.</span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-charcoal-600 leading-relaxed max-w-2xl mx-auto">
                Stop managing reservations across Telegram chats, paper logbooks, and spreadsheets. 
                Give your property its own direct booking website and a centralized front-desk dashboard.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/hotels/angkor-pavilion"
                  className="w-full sm:w-auto px-8 py-4 bg-forest-800 hover:bg-forest-900 text-ivory-50 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Hotel className="w-5 h-5 text-gold-400" />
                  View Angkor Pavilion Demo
                </Link>

                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-ivory-100 text-forest-900 border border-ivory-300 text-base font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <CalendarDays className="w-5 h-5 text-forest-700" />
                  Open Hotel Dashboard
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-forest-600" /> No Setup Fees</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Bilingual Khmer & English</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Bakong & ABA Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-20 bg-ivory-100/60 border-y border-ivory-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold font-display text-forest-900">
                Everything small hotels need to take control
              </h2>
              <p className="mt-3 text-charcoal-600">
                Designed specifically for the realities of hospitality in Siem Reap, Phnom Penh, Kampot, and the Islands.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card-hospitality p-8 hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-forest-900 mb-2">Direct Booking Engine</h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">
                  Every property receives its own shareable link (e.g., <code className="text-xs bg-ivory-200 px-1 py-0.5 rounded text-forest-800">staypilot.com/hotel/angkor-pavilion</code>). 
                  High-res photography, instant availability checks, and automatic vouchers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card-hospitality p-8 hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-800 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-forest-900 mb-2">Double-Booking Shield</h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">
                  Atomic row-level locking ensures walk-ins, phone bookings, and web reservations 
                  update live room counts instantly. Zero risk of overbooking the same room.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card-hospitality p-8 hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-6">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-forest-900 mb-2">Local Cambodian Payments</h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">
                  Support Pay-at-Property (Cash on arrival), Bakong KHQR scan with receipt upload, 
                  and future automated ABA PayWay gateway integration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Table */}
        <section id="pricing" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold font-display text-forest-900">
                Transparent, affordable monthly plans
              </h2>
              <p className="mt-3 text-charcoal-600">
                No commission per booking. Keep 100% of your room revenue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
              {/* Starter */}
              <div className="card-hospitality p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-forest-900">Starter</h3>
                  <p className="text-sm text-charcoal-500 mt-1">For small guesthouses & homestays</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-forest-900">$9</span>
                    <span className="text-sm font-medium text-charcoal-500">/ month</span>
                  </div>
                  <ul className="mt-8 space-y-3 text-sm text-charcoal-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Branded direct booking page</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Up to 10 rooms</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Manual walk-in logging</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Khmer & English interface</li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 w-full py-3 bg-ivory-100 hover:bg-ivory-200 text-forest-900 font-semibold rounded-xl text-center text-sm transition"
                >
                  Start 14-Day Free Trial
                </Link>
              </div>

              {/* Pro */}
              <div className="card-hospitality-elevated p-8 flex flex-col justify-between border-2 border-forest-600 relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-forest-800 text-ivory-50 text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm">
                  Most Popular for Boutiques
                </div>
                <div>
                  <h3 className="text-xl font-bold text-forest-900">Pro</h3>
                  <p className="text-sm text-charcoal-500 mt-1">For boutique hotels & small resorts</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-forest-900">$19</span>
                    <span className="text-sm font-medium text-charcoal-500">/ month</span>
                  </div>
                  <ul className="mt-8 space-y-3 text-sm text-charcoal-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Everything in Starter</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Up to 30 rooms</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Visual calendar tape-chart</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Bakong KHQR payments</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Housekeeping status board</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Revenue & occupancy reports</li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 w-full py-3 bg-forest-800 hover:bg-forest-900 text-ivory-50 font-semibold rounded-xl text-center text-sm shadow transition"
                >
                  Start 14-Day Free Trial
                </Link>
              </div>

              {/* Business */}
              <div className="card-hospitality p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-forest-900">Business</h3>
                  <p className="text-sm text-charcoal-500 mt-1">Multi-property & established resorts</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-forest-900">$39</span>
                    <span className="text-sm font-medium text-charcoal-500">/ month</span>
                  </div>
                  <ul className="mt-8 space-y-3 text-sm text-charcoal-700">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Everything in Pro</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Unlimited rooms & properties</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Unlimited staff accounts</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Advanced rate plans & yields</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-600" /> Priority Telegram phone support</li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 w-full py-3 bg-ivory-100 hover:bg-ivory-200 text-forest-900 font-semibold rounded-xl text-center text-sm transition"
                >
                  Start 14-Day Free Trial
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-forest-900 text-ivory-200 py-12 border-t border-forest-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-gold-400" />
            <span className="text-xl font-display font-bold text-ivory-50">StayPilot</span>
            <span className="text-xs text-ivory-300">© 2026 StayPilot Hospitality Systems. Cambodia.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-ivory-300">
            <Link href="/hotels/angkor-pavilion" className="hover:text-gold-400 transition">Sample Hotel</Link>
            <Link href="/dashboard" className="hover:text-gold-400 transition">Hotel Portal</Link>
            <span className="text-xs bg-forest-800 px-2.5 py-1 rounded-full text-gold-300 border border-forest-700">KHR ៛ & USD $</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
