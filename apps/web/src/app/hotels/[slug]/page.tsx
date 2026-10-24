'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Check, 
  Wifi, 
  Coffee, 
  Waves, 
  Car, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Users, 
  Bed, 
  Maximize2,
  Phone,
  Send,
  Languages
} from 'lucide-react';
import { formatUsd, formatKhr, usdCentsToKhr } from '@staypilot/shared-types';

// Demo data for Angkor Pavilion Boutique Resort (Siem Reap)
const SAMPLE_HOTEL = {
  name: 'Angkor Pavilion Boutique',
  slug: 'angkor-pavilion',
  tagline: 'Quiet luxury and Khmer heritage nestled near the temples',
  descriptionEn:
    'A peaceful sanctuary of Khmer charm and refined tranquility located in Wat Bo Village, Siem Reap. Featuring handcrafted teakwood furnishings, a saltwater swimming pool framed by lush frangipani trees, and bespoke hospitality just 15 minutes from Angkor Wat.',
  descriptionKh:
    'រមណីយដ្ឋានបែបប្រណិតនៅភូមិវត្តបូព៌ ក្រុងសៀមរាប ក្បែរប្រាសាទអង្គរវត្ត។ មានគ្រឿងសង្ហារិមឈើប្រណិត អាងហែលទឹកធម្មជាតិ និងសួនផ្កាចំប៉ីដ៏ស្រស់បំព្រង។',
  coverImageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
  galleryUrls: [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
  ],
  addressLine: 'Street 24, Wat Bo Village, Siem Reap',
  phone: '+855 63 963 888',
  email: 'reservations@angkorpavilion.com',
  telegram: '@angkorpavilion',
  usdToKhrRate: 4100,
  checkInTime: '14:00',
  checkOutTime: '12:00',
  cancellationPolicy: 'Free cancellation up to 48 hours prior to arrival date.',
  amenities: [
    { name: 'Saltwater Swimming Pool', icon: Waves },
    { name: 'Complimentary Khmer Breakfast', icon: Coffee },
    { name: 'High-Speed Wi-Fi', icon: Wifi },
    { name: 'Free Airport Shuttle', icon: Car },
    { name: '24/7 Front Desk Concierge', icon: Clock },
    { name: 'Spa & Traditional Khmer Massage', icon: Sparkles },
  ],
  roomTypes: [
    {
      id: 'rt-1',
      name: 'Deluxe Balcony King',
      slug: 'deluxe-balcony-king',
      descriptionEn: 'Spacious 38 sqm room with private garden-view balcony, plush king bed, and rain shower.',
      descriptionKh: 'បន្ទប់ទំហំ ៣៨ ម៉ែត្រការ៉េ មានយ៉រមើលសួនច្បារ គ្រែធំស្តេច និងបន្ទប់ទឹកផ្កាឈូកទំនើប។',
      basePriceInCents: 4500, // $45.00
      roomSizeSqm: 38,
      bedConfiguration: '1 King Bed',
      maxAdults: 2,
      maxChildren: 1,
      availableCount: 4,
      photo: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
      amenities: ['Private Balcony', 'Espresso Machine', 'Air Conditioning', 'Free Minibar'],
    },
    {
      id: 'rt-2',
      name: 'Khmer Traditional Suite',
      slug: 'khmer-traditional-suite',
      descriptionEn: 'Grand 55 sqm suite adorned with antique Cambodian silks, handcrafted teak wood, and terrazzo bathtub.',
      descriptionKh: 'បន្ទប់ឈុតធំទូលាយ ៥៥ ម៉ែត្រការ៉េ រចនាបែបប្រពៃណីខ្មែរ មានអាងត្រាំទឹកថ្មម៉ាប។',
      basePriceInCents: 7500, // $75.00
      roomSizeSqm: 55,
      bedConfiguration: '1 Super King + 1 Daybed',
      maxAdults: 3,
      maxChildren: 2,
      availableCount: 3,
      photo: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      amenities: ['Deep Soaking Tub', 'Pool View', 'Living Lounge', 'Daily Tropical Fruit Basket'],
    },
    {
      id: 'rt-3',
      name: 'Frangipani Garden Villa',
      slug: 'frangipani-garden-villa',
      descriptionEn: 'Standalone 75 sqm private villa surrounded by fragrant frangipani trees and outdoor stone plunge bath.',
      descriptionKh: 'វីឡាដាច់ដោយឡែកទំហំ ៧៥ ម៉ែត្រការ៉េ ព័ទ្ធជុំវិញដោយសួនត្រូពិច និងអាងត្រាំទឹកថ្មធម្មជាតិ។',
      basePriceInCents: 12000, // $120.00
      roomSizeSqm: 75,
      bedConfiguration: '2 King Beds',
      maxAdults: 4,
      maxChildren: 2,
      availableCount: 2,
      photo: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80',
      amenities: ['Private Garden Patio', 'Outdoor Stone Bath', 'Butler Service', 'Direct Pool Access'],
    },
  ],
};

export default function HotelPublicPage({ params }: { params: { slug: string } }) {
  const [lang, setLang] = useState<'en' | 'kh'>('en');
  const [currency, setCurrency] = useState<'USD' | 'KHR'>('USD');
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(2);

  const hotel = SAMPLE_HOTEL;

  const formatPrice = (cents: number) => {
    if (currency === 'KHR') {
      const khr = usdCentsToKhr(cents, hotel.usdToKhrRate);
      return formatKhr(khr);
    }
    return formatUsd(cents);
  };

  return (
    <div className="min-h-screen bg-ivory-50 pb-24">
      {/* Top Bar with Language & Currency toggles */}
      <div className="bg-forest-900 text-ivory-200 text-xs py-2 px-4 border-b border-forest-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold-400" /> {hotel.addressLine}</span>
            <span className="hidden sm:flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gold-400" /> {hotel.phone}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'kh' : 'en')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-forest-800 hover:bg-forest-700 text-gold-300 transition"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'ភាសាខ្មែរ (Khmer)' : 'English'}</span>
            </button>

            {/* Currency toggle */}
            <button
              onClick={() => setCurrency(currency === 'USD' ? 'KHR' : 'USD')}
              className="px-2 py-0.5 rounded bg-forest-800 hover:bg-forest-700 text-ivory-100 font-semibold transition"
            >
              {currency === 'USD' ? '$ USD' : '៛ KHR'}
            </button>
          </div>
        </div>
      </div>

      {/* Hotel Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ivory-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display text-forest-900 tracking-tight">{hotel.name}</h1>
            <p className="text-xs text-charcoal-500 hidden sm:block">{hotel.tagline}</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#rooms"
              className="px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-ivory-50 text-sm font-semibold rounded-xl shadow-sm hover:shadow transition flex items-center gap-2"
            >
              <span>{lang === 'kh' ? 'ជ្រើសរើសបន្ទប់' : 'Select a Room'}</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Photo Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[420px] rounded-2xl overflow-hidden shadow-md">
          <div className="md:col-span-2 h-full relative group cursor-pointer overflow-hidden">
            <img
              src={hotel.coverImageUrl}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" /> Saltwater Tropical Pool & Gardens
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-3 h-full">
            <div className="h-1/2 overflow-hidden relative group cursor-pointer rounded-xl">
              <img
                src={hotel.galleryUrls[1]}
                alt="Boutique Room"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="h-1/2 overflow-hidden relative group cursor-pointer rounded-xl">
              <img
                src={hotel.galleryUrls[2]}
                alt="Teakwood Details"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          <div className="hidden md:block h-full overflow-hidden relative group cursor-pointer rounded-xl">
            <img
              src={hotel.galleryUrls[3]}
              alt="Balcony Views"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/20 transition">
              <span className="text-white font-semibold text-sm bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                +12 More Photos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Availability Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="card-hospitality-elevated p-6 bg-white border border-ivory-300">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-500 mb-1.5">
                {lang === 'kh' ? 'ថ្ងៃចូលស្នាក់នៅ' : 'Check-In Date'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-xl text-sm font-medium text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
                <Calendar className="w-4 h-4 text-forest-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-500 mb-1.5">
                {lang === 'kh' ? 'ថ្ងៃចាកចេញ' : 'Check-Out Date'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-xl text-sm font-medium text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
                <Calendar className="w-4 h-4 text-forest-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-500 mb-1.5">
                {lang === 'kh' ? 'ចំនួនភ្ញៀវ' : 'Guests'}
              </label>
              <div className="relative">
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full pl-10 pr-3 py-2.5 bg-ivory-50 border border-ivory-300 rounded-xl text-sm font-medium text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-700"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4 Adults</option>
                </select>
                <Users className="w-4 h-4 text-forest-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <a
                href="#rooms"
                className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-ivory-50 font-semibold rounded-xl text-sm shadow flex items-center justify-center gap-2 transition"
              >
                <span>{lang === 'kh' ? 'ពិនិត្យបន្ទប់ទំនេរ' : 'Check Availability'}</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Story & Amenities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-display font-bold text-forest-900 mb-4">
              {lang === 'kh' ? 'អំពីយើងខ្ញុំ' : 'About the Property'}
            </h2>
            <p className="text-charcoal-600 leading-relaxed text-base whitespace-pre-line">
              {lang === 'kh' ? hotel.descriptionKh : hotel.descriptionEn}
            </p>

            <div className="mt-8 pt-8 border-t border-ivory-200">
              <h3 className="text-lg font-bold text-forest-900 mb-4">
                {lang === 'kh' ? 'សេវាកម្ម និងបរិក្ខារ' : 'Property Amenities'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hotel.amenities.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-ivory-100/70 border border-ivory-200">
                      <Icon className="w-5 h-5 text-forest-700 flex-shrink-0" />
                      <span className="text-xs font-semibold text-charcoal-800">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="card-hospitality p-6 bg-white h-fit">
            <h3 className="text-lg font-bold text-forest-900 mb-4">
              {lang === 'kh' ? 'លក្ខខណ្ឌស្នាក់នៅ' : 'Hotel Policies'}
            </h3>
            <div className="space-y-4 text-sm text-charcoal-700">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold-500 mt-0.5" />
                <div>
                  <span className="font-semibold block text-forest-900">Check-In / Check-Out</span>
                  <span>Check-in: from {hotel.checkInTime}</span><br />
                  <span>Check-out: until {hotel.checkOutTime}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gold-500 mt-0.5" />
                <div>
                  <span className="font-semibold block text-forest-900">Cancellation Policy</span>
                  <span className="text-xs text-charcoal-600">{hotel.cancellationPolicy}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Send className="w-5 h-5 text-gold-500 mt-0.5" />
                <div>
                  <span className="font-semibold block text-forest-900">Telegram Direct Inquiries</span>
                  <a href={`https://t.me/${hotel.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-xs text-forest-700 underline font-semibold">
                    {hotel.telegram}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Room Types */}
      <section id="rooms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-forest-900">
              {lang === 'kh' ? 'ប្រភេទបន្ទប់ស្នាក់នៅ' : 'Available Room Categories'}
            </h2>
            <p className="mt-1 text-sm text-charcoal-600">
              {lang === 'kh' 
                ? 'តម្លៃផ្ទាល់ពីសណ្ឋាគារ មិនគិតថ្លៃកម្រៃជើងសារ' 
                : 'Direct rates guaranteed. Complimentary Khmer breakfast included.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold-50 border border-gold-200 text-gold-800 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-gold-600" />
            1 USD = {hotel.usdToKhrRate.toLocaleString()} KHR
          </div>
        </div>

        <div className="space-y-8">
          {hotel.roomTypes.map((room) => (
            <div
              key={room.id}
              className="card-hospitality p-6 bg-white hover:border-forest-400 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              {/* Room Photo */}
              <div className="md:col-span-4 h-56 rounded-xl overflow-hidden relative">
                <img
                  src={room.photo}
                  alt={room.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-forest-900/80 backdrop-blur-sm text-ivory-50 text-xs font-semibold px-2.5 py-1 rounded-md">
                  {room.availableCount} rooms left
                </div>
              </div>

              {/* Room Details */}
              <div className="md:col-span-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-display text-forest-900 mb-2">{room.name}</h3>
                  <p className="text-sm text-charcoal-600 leading-relaxed mb-4">
                    {lang === 'kh' ? room.descriptionKh : room.descriptionEn}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-charcoal-700 mb-4">
                    <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4 text-forest-700" /> {room.roomSizeSqm} m²</span>
                    <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-forest-700" /> {room.bedConfiguration}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-forest-700" /> Max {room.maxAdults} Adults</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, idx) => (
                      <span key={idx} className="text-[11px] font-medium bg-ivory-100 text-charcoal-700 px-2 py-0.5 rounded border border-ivory-200">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-ivory-200 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between items-start md:items-end">
                <div className="text-left md:text-right w-full mb-6">
                  <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold block">From</span>
                  <div className="text-3xl font-extrabold text-forest-900 tracking-tight">
                    {formatPrice(room.basePriceInCents)}
                  </div>
                  <span className="text-xs text-charcoal-500 block">per night · taxes included</span>
                  {currency === 'USD' && (
                    <span className="text-[11px] font-medium text-gold-600 block mt-0.5">
                      ≈ {formatKhr(usdCentsToKhr(room.basePriceInCents, hotel.usdToKhrRate))}
                    </span>
                  )}
                </div>

                <Link
                  href={`/book/${hotel.slug}?roomType=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`}
                  className="w-full py-3 bg-forest-800 hover:bg-forest-900 text-ivory-50 font-semibold rounded-xl text-center text-sm shadow hover:shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>{lang === 'kh' ? 'កក់បន្ទប់នេះ' : 'Book Direct'}</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
