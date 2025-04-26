// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { AuthProvider } from '@/context/AuthContext';
import { Inter } from 'next/font/google';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Car Rental Service',
  description: 'Rent a car for your next adventure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <AuthProvider>
            {children}
            <Footer />
          </AuthProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}