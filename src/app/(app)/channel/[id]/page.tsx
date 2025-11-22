import { channels, messages, getCurrentUser } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChatPageClient } from '@/components/chat-page-client';

export default function ChannelPage({ params }: { params: { id: string } }) {
  const currentUser = getCurrentUser();
  const channel = channels.find((c) => c.id === params.id);

  if (!channel) {
    notFound();
  }

  const channelMessages = messages.filter((m) => m.channelId === channel.id);

  return (
    <ChatPageClient
      currentUser={currentUser}
      messages={channelMessages}
      chatTarget={channel}
    />
  );
}

export function generateStaticParams() {
  return channels.map((channel) => ({
    id: channel.id,
  }));
}
