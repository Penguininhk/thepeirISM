import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import React from 'react';
import AppLogo from '@/components/app-logo';

export const metadata: Metadata = {
  title: 'The Harbour School Portal',
  description: 'The official portal for students and teachers of The Harbour School, Hong Kong.',
};

function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <AppLogo className="h-24 w-24 animate-pulse" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-primary">Loading...</h2>
          <p className="text-muted-foreground">
            Please be patient while we fetch the next page.
          </p>
        </div>
      </div>
       <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
            <svg
              className="waves-svg absolute bottom-0 left-0 h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 24 150 28"
              preserveAspectRatio="none"
              shapeRendering="auto"
            >
              <defs>
                <path
                  id="gentle-wave"
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                />
              </defs>
              <g className="waves">
                <use href="#gentle-wave" x="48" y="0" fill="hsl(var(--primary) / 0.1)" />
                <use href="#gentle-wave" x="48" y="3" fill="hsl(var(--primary) / 0.15)" />
                <use href="#gentle-wave" x="48" y="5" fill="hsl(var(--primary) / 0.05)" />
                <use href="#gentle-wave" x="48" y="7" fill="hsl(var(--primary) / 0.2)" />
              </g>
            </svg>
        </div>
    </div>
  );
}


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
