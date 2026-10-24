'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, Lock, Mail, ArrowRight, ShieldCheck, Hotel, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('owner@angkorpavilion.com');
  const [password, setPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock login session or API call
      localStorage.setItem('staypilot_token', 'mock_token_sophea_angkor_pavilion');
      localStorage.setItem('staypilot_hotel_id', 'hotel-angkor-pavilion');
      setTimeout(() => {
        router.push('/dashboard');
      }, 400);
    } finally {
      setIsLoading(false);
    }
  };

  const fillSampleOwner = () => {
    setEmail('owner@angkorpavilion.com');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-ivory-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 flex items-center justify-center text-ivory-50 shadow-md">
            <Compass className="w-7 h-7 text-gold-400" />
          </div>
          <span className="text-3xl font-bold font-display text-forest-900">StayPilot</span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold font-display text-forest-900">Hotel Owner & Staff Login</h2>
        <p className="mt-1 text-xs text-charcoal-500">
          Access your front-desk tape-chart, room turnover, and direct bookings.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="card-hospitality p-8 bg-white border border-ivory-300 shadow-md">
          {/* Quick Demo Credentials Button */}
          <div className="mb-6 p-4 rounded-xl bg-gold-50 border border-gold-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span className="text-xs font-bold text-gold-900">Sample Hotel Account</span>
              </div>
              <button
                type="button"
                onClick={fillSampleOwner}
                className="text-[11px] font-bold text-forest-800 underline hover:text-forest-900"
              >
                Auto-Fill
              </button>
            </div>
            <p className="text-[11px] text-charcoal-600 mt-1">
              Angkor Pavilion Boutique (Siem Reap) · Owner: Sophea Pich
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-ivory-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-forest-800 hover:bg-forest-900 text-ivory-50 font-semibold rounded-xl text-sm shadow hover:shadow-md transition flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Signing in...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-ivory-200 text-center text-xs text-charcoal-500">
            <span>Are you a guest checking a booking? </span>
            <Link href="/hotels/angkor-pavilion" className="text-forest-800 font-bold hover:underline">
              Visit Hotel Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
