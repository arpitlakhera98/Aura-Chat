

'use client';

import * as React from 'react';
import type { Message, User, Channel } from '@/lib/data';
import { addMessage } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { SendHorizonal, Hash, ShieldX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SummarizeDialog } from './summarize-dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface ChatPageClientProps {
  currentUser: User;
  messages: Message[];
  chatTarget: User | Channel;
  isChannel: boolean;
}

export function ChatPageClient({
  currentUser,
  messages,
  chatTarget,
  isChannel,
}: ChatPageClientProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      user: currentUser,
    };
    
    if (isChannel) {
        message.channelId = chatTarget.id;
    } else {
        message.dmId = [currentUser.id, (chatTarget as User).id].sort().join('-');
    }

    addMessage(message);
    setNewMessage('');
  };

  const handleBlockUser = () => {
    toast({
      title: 'User Blocked (Not Implemented)',
      description: `You have blocked ${(chatTarget as User).name}. This is a placeholder action.`,
    });
  };
  
  if (!currentUser) {
    return <div>Loading chat...</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4">
        <div className="flex items-center gap-2 font-semibold">
          {isChannel ? (
            <Hash className="h-6 w-6 text-muted-foreground" />
          ) : (
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={(chatTarget as User).avatarUrl} />
              <AvatarFallback>{(chatTarget as User).name[0]}</AvatarFallback>
            </Avatar>
          )}
          <span>{chatTarget.name}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {isChannel && <SummarizeDialog messages={messages} />}
          {!isChannel && (
            <Button variant="ghost" size="icon" onClick={handleBlockUser}>
              <ShieldX className="h-4 w-4" />
              <span className="sr-only">Block User</span>
            </Button>
          )}
        </div>
      </header>

      <main
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-end gap-2',
              message.user.id === currentUser.id ? 'justify-end' : ''
            )}
          >
            {message.user.id !== currentUser.id && (
              <Avatar className="h-8 w-8">
                <AvatarImage asChild src={message.user.avatarUrl}>
                  <Image src={message.user.avatarUrl} alt={message.user.name} width={32} height={32} />
                </AvatarImage>
                <AvatarFallback>{message.user.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-xs rounded-lg p-3 text-sm md:max-w-md',
                message.user.id === currentUser.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card'
              )}
            >
              {message.user.id !== currentUser.id && (
                <p className="text-xs font-semibold pb-1">{message.user.name}</p>
              )}
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="border-t p-4 bg-card">
        <form onSubmit={handleSendMessage}>
          <Card>
            <div className="relative">
              <Textarea
                placeholder="Type your message..."
                className="resize-none pr-20"
                rows={1}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
              >
                <SendHorizonal className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </Card>
        </form>
      </footer>
    </div>
  );
}
