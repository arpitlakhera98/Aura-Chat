
'use client';

import * as React from 'react';
import { users, useMessages, useCurrentUser, type User, type Message } from '@/lib/data';
import { ChatPageClient } from '@/components/chat-page-client';

export default function DMPage({ params }: { params: { id:string } }) {
  const resolvedParams = React.use(params);
  const currentUser = useCurrentUser();
  const allMessages = useMessages();
  const otherUser = users.find((u) => u.id === resolvedParams.id);
  const [dmMessages, setDmMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    if (currentUser && otherUser) {
      const dmId = [currentUser.id, otherUser.id].sort().join('-');
      setDmMessages(allMessages.filter((m) => m.dmId === dmId));
    }
  }, [currentUser, otherUser, allMessages]);

  if (!otherUser || !currentUser) {
    // You might want a loading state here
    return <div>Loading...</div>;
  }

  return (
    <ChatPageClient
      currentUser={currentUser}
      messages={dmMessages}
      chatTarget={otherUser}
    />
  );
}
