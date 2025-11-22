
'use client';

import * as React from 'react';
import { useChannels, useMessages, useCurrentUser, type Channel, type Message, clearMessagesForChannel, markChatAsRead, getChannels } from '@/lib/data';
import { ChatPageClient } from '@/components/chat-page-client';
import { useRouter } from 'next/navigation';

export default function ChannelPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const currentUser = useCurrentUser();
  const allMessages = useMessages();
  const channels = useChannels();
  const router = useRouter();
  const [channel, setChannel] = React.useState<Channel | undefined>(undefined);
  const [channelMessages, setChannelMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  React.useEffect(() => {
    const allChannels = getChannels();
    const foundChannel = allChannels.find((c) => c.id === resolvedParams.id);
    
    if (foundChannel) {
        if (currentUser && !foundChannel.memberIds.includes(currentUser.id)) {
            // Redirect if user is not a member
            router.push('/channel/1');
            return;
        }
        setChannel(foundChannel);
    }

    if (foundChannel) {
      markChatAsRead(foundChannel.id);
      setChannelMessages(allMessages.filter((m) => m.channelId === foundChannel.id));
    }
  }, [resolvedParams.id, allMessages, channels, currentUser, router]);


  const handleClearChat = () => {
    if (channel) {
      clearMessagesForChannel(channel.id);
    }
  };

  if (!channel || !currentUser) {
    // You might want a loading state here
    return <div>Loading...</div>;
  }
  
  // Re-check membership in case of async data loading
  if (!channel.memberIds.includes(currentUser.id)) {
      return <div>Access Denied. You are not a member of this channel.</div>;
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
