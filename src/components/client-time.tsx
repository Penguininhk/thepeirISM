'use client';

import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

interface ClientTimeProps {
  timestamp: string;
  className?: string;
  formatString?: string;
}

export function ClientTime({ timestamp, className, formatString = 'PPPpp' }: ClientTimeProps) {
  const [time, setTime] = useState<{ title: string; relative: string } | null>(null);

  useEffect(() => {
    const date = new Date(timestamp);
    setTime({
      title: format(date, formatString),
      relative: formatDistanceToNow(date, { addSuffix: true }),
    });
  }, [timestamp, formatString]);

  if (!time) {
    return <span className={className}>...</span>;
  }

  return (
    <time className={className} title={time.title}>
      {time.relative}
    </time>
  );
}
