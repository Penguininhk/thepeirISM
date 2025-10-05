
'use client';

import * as React from 'react';
import { facultyChat, teacherProfile } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Hash } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ChatChannel } from '@/lib/data';

export default function FacultyLoungePage() {
  const [activeChannel, setActiveChannel] = React.useState<ChatChannel>(facultyChat[0]);
  const [newMessage, setNewMessage] = React.useState('');

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend.
      // Here, we just log it and clear the input.
      console.log(`Sending to ${activeChannel.name}: ${newMessage}`);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))]">
      {/* Channel List */}
      <div className="w-64 border-r bg-muted/20 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold font-headline">Faculty Lounge</h1>
          <p className="text-sm text-muted-foreground">Internal Chat</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <h2 className="px-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Channels</h2>
            {facultyChat.map(channel => (
              <Button
                key={channel.id}
                variant="ghost"
                className={cn(
                  'w-full justify-start',
                  activeChannel.id === channel.id && 'bg-accent text-accent-foreground'
                )}
                onClick={() => setActiveChannel(channel)}
              >
                <Hash className="mr-2 h-4 w-4" />
                {channel.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">#{activeChannel.name}</h2>
          <p className="text-sm text-muted-foreground">{activeChannel.description}</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {activeChannel.messages.map((message, index) => (
              <div key={message.id} className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={message.author.avatarUrl} alt={message.author.name} />
                  <AvatarFallback>{getInitials(message.author.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="font-semibold">{message.author.name}</p>
                    <time className="text-xs text-muted-foreground" title={format(new Date(message.timestamp), "PPPpp")}>
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </time>
                  </div>
                  <p className="text-foreground/90">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-card">
          <div className="relative">
            <Input
              placeholder={`Message #${activeChannel.name}`}
              className="pr-12"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-9"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
