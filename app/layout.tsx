import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-dark-900">
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