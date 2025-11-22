import { users, messages, getCurrentUser } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ChatPageClient } from '@/components/chat-page-client';

export default function DMPage({ params }: { params: { id: string } }) {
  const currentUser = getCurrentUser();
  const otherUser = users.find((u) => u.id === params.id);

  if (!otherUser) {
    notFound();
  }
  
  // DM IDs are stored as 'user1Id-user2Id' sorted numerically
  const dmId = [currentUser.id, otherUser.id].sort().join('-');

  const dmMessages = messages.filter((m) => m.dmId === dmId);

  return (
    <ChatPageClient
      currentUser={currentUser}
      messages={dmMessages}
      chatTarget={otherUser}
    />
  );
}
