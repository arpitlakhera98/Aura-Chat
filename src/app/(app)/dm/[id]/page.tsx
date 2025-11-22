
'use client';

import * as React from 'react';
import { users, useMessages, useCurrentUser, type User, type Message } from '@/lib/data';
import { ChatPageClient } from '@/components/chat-page-client';
import { notFound } from 'next/navigation';

export default function DMPage({ params }: { params: { id:string } }) {
  const resolvedParams = React.use(params);
  const currentUser = useCurrentUser();
  const allMessages = useMessages();
  const [otherUser, setOtherUser] = React.useState<User | undefined>(undefined);
  const [dmMessages, setDmMessages] = React.useState<Message[]>([]);

  React.useEffect(() => {
    const foundUser = users.find((u) => u.id === resolvedParams.id);
    setOtherUser(foundUser);
  }, [resolvedParams.id]);

  React.useEffect(() => {
    if (currentUser && otherUser) {
      const dmId = [currentUser.id, otherUser.id].sort().join('-');
      setDmMessages(allMessages.filter((m) => m.dmId === dmId));
    }
  }, [currentUser, otherUser, allMessages]);
  
  if (otherUser === undefined || !currentUser) {
    return <div>Loading...</div>;
  }
  
  if (otherUser === null) {
      notFound();
  }


  return (
    <ChatPageClient
      currentUser={currentUser}
      messages={dmMessages}
      chatTarget={otherUser}
      isChannel={false}
    />
  );
}
