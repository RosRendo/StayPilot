import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StayPilot — Hotel Booking & Operations SaaS for Cambodia',
  description: 'Empowering independent hotels, guesthouses, and eco-resorts with direct bookings, automated room management, and zero OTA commission.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory-50 text-charcoal-800 antialiased selection:bg-forest-100 selection:text-forest-900">
        {children}
      </body>
    </html>
  );
}
