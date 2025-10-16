import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Loading from './loading';
import React from 'react';

export const metadata: Metadata = {
  title: 'The Harbour School Portal',
  description: 'The official portal for students and teachers of The Harbour School, Hong Kong.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="absolute top-0 -z-10 h-full w-full bg-background">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.05),transparent)]"></div>
        </div>
        <React.Suspense fallback={<Loading />}>
          {children}
        </React.Suspense>
        <Toaster />
      </body>
    </html>
  );
}
