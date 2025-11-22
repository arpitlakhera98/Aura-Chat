
'use client';

import * as React from 'react';
import { channels, useMessages, useCurrentUser, type Channel, type Message, clearMessagesForChannel } from '@/lib/data';
import { ChatPageClient } from '@/components/chat-page-client';
import { useRouter } from 'next/navigation';

export default function ChannelPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const currentUser = useCurrentUser();
  const allMessages = useMessages();
  const router = useRouter();
  const channel = channels.find((c) => c.id === resolvedParams.id);
  const [channelMessages, setChannelMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  React.useEffect(() => {
    if (channel) {
      setChannelMessages(allMessages.filter((m) => m.channelId === channel.id));
    }
  }, [channel, allMessages]);

  const handleClearChat = () => {
    if (channel) {
      clearMessagesForChannel(channel.id);
    }
  };

  if (!channel || !currentUser) {
    // You might want a loading state here
    return <div>Loading...</div>;
  }

  return (
    <ChatPageClient
      currentUser={currentUser}
      messages={channelMessages}
      chatTarget={channel}
      isChannel={true}
      onClearChat={handleClearChat}
    />
  );
}
