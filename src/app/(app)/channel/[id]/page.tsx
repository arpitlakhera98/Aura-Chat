
'use client';

import * as React from 'react';
import { channels, useMessages, useCurrentUser, type Channel, type Message } from '@/lib/data';
import { ChatPageClient } from '@/components/chat-page-client';

export default function ChannelPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const currentUser = useCurrentUser();
  const allMessages = useMessages();
  const channel = channels.find((c) => c.id === resolvedParams.id);
  const [channelMessages, setChannelMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    if (channel) {
      setChannelMessages(allMessages.filter((m) => m.channelId === channel.id));
    }
  }, [channel, allMessages]);

  if (!channel) {
    // You might want a loading state here
    return <div>Loading...</div>;
  }

  return (
    <ChatPageClient
      currentUser={currentUser}
      messages={channelMessages}
      chatTarget={channel}
      isChannel={true}
    />
  );
}
