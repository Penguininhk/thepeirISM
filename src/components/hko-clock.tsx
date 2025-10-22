
'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function HkoClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Hong_Kong',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
      }));
      setDate(now.toLocaleDateString('en-US', {
        timeZone: 'Asia/Hong_Kong',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }));
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="text-sidebar-foreground/80 group-data-[collapsible=icon]:hidden">
      {time ? (
        <>
          <div className="flex items-center justify-start gap-2">
            <Clock className="h-4 w-4" />
            <p className="font-mono text-lg font-semibold">{time}</p>
          </div>
          <p className="text-xs">{date}</p>
        </>
      ) : (
        <div className="h-10 animate-pulse" />
      )}
    </div>
  );
}
