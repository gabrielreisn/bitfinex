'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { Provider } from 'react-redux';
import { reduxStore } from '@/lib/redux/store';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={reduxStore}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Provider>
  );
}
