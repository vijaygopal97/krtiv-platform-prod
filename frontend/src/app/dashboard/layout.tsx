import { Inter, Playfair_Display } from 'next/font/google';
import '@/styles/travel-dashboard.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className={`travel-dash min-h-screen ${inter.variable} ${playfair.variable}`}>{children}</div>;
}
