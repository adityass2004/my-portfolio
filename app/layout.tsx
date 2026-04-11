import type { Metadata } from 'next';
import { Inter, DM_Serif_Display, DM_Mono, Instrument_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-serif' });
const dmMono = DM_Mono({ weight: ['300', '400', '500'], subsets: ['latin'], variable: '--font-mono' });
const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Aditya Sagar - Full Stack Developer',
  description: 'B.Tech CSE Student & Full Stack Developer building scalable web applications with React, Node.js & Databases',
  keywords: 'Full Stack Developer, React, Node.js, TypeScript, Web Development, Portfolio',
  authors: [{ name: 'Aditya Sagar' }],
  openGraph: {
    title: 'Aditya Sagar - Full Stack Developer',
    description: 'B.Tech CSE Student & Full Stack Developer',
    url: 'https://adityass-portfolio.netlify.app',
    siteName: 'Aditya Sagar Portfolio',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${dmSerif.variable} ${dmMono.variable} ${instrumentSans.variable}`}>
      <body className={instrumentSans.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-paper text-ink">
            <CustomCursor />
            <Navbar />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}