
'use client';

import * as React from 'react';
import { channels, messages, useCurrentUser, type Channel, type Message } from '@/lib/data';
import { ChatPageClient } from '@/components/chat-page-client';

export default function ChannelPage({ params }: { params: { id: string } }) {
  const currentUser = useCurrentUser();
  const channel = channels.find((c) => c.id === params.id);
  const [channelMessages, setChannelMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    if (channel) {
      setChannelMessages(messages.filter((m) => m.channelId === channel.id));
    }
  }, [channel]);

  if (!channel) {
    // You might want a loading state here
    return <div>Loading...</div>;
  }

  return (
    <ChatPageClient
      currentUser={currentUser}
      messages={channelMessages}
      chatTarget={channel}
    />
  );
}
