// app/layout.js
import { ClerkProvider } from '@clerk/nextjs';
import { AuthProvider } from '@/context/AuthContext';
import { Inter } from 'next/font/google';
import Footer from '@/components/layout/Footer';
import './globals.css';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Car Rental Service',
  description: 'Find and rent your ideal car',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              {/* Header removed from here */}
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}