
'use client';

import { useState, useEffect } from 'react';

// A simple event emitter for our mock data
class EventEmitter<T> {
  private listeners: ((data: T) => void)[] = [];

  subscribe(listener: (data: T) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(data: T) {
    this.listeners.forEach((listener) => listener(data));
  }
}


export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  email: string;
  isActive: boolean;
  bio: string;
  lastSeen: string | 'online';
};

export type Channel = {
  id: string;
  name: string;
  adminId: string;
  memberIds: string[];
};

export type Message = {
  id: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  user: User;
  channelId?: string;
  dmId?: string;
};

export let users: User[] = [
  {
    id: '1',
    name: 'Alex',
    avatarUrl: 'https://picsum.photos/seed/1/96/96',
    age: 28,
    gender: 'Male',
    email: 'alex@example.com',
    isActive: true,
    bio: 'Software engineer and coffee enthusiast.',
    lastSeen: 'online',
  },
  {
    id: '2',
    name: 'Maya',
    avatarUrl: 'https://picsum.photos/seed/2/96/96',
    age: 32,
    gender: 'Female',
    email: 'maya@example.com',
    isActive: true,
    bio: 'Designer, painter, and dog lover.',
    lastSeen: 'online',
  },
  {
    id: '3',
    name: 'Leo',
    avatarUrl: 'https://picsum.photos/seed/3/96/96',
    age: 25,
    gender: 'Male',
    email: 'leo@example.com',
    isActive: false,
    bio: 'Musician and part-time philosopher.',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '4',
    name: 'Chloe',
    avatarUrl: 'https://picsum.photos/seed/4/96/96',
    age: 29,
    gender: 'Female',
    email: 'chloe@example.com',
    isActive: true,
    bio: 'Marketing guru and travel addict.',
    lastSeen: 'online',
  },
  {
    id: '5',
    name: 'Ben',
    avatarUrl: 'https://picsum.photos/seed/5/96/96',
    age: 35,
    gender: 'Male',
    email: 'ben@example.com',
    isActive: false,
    bio: 'Product manager, always learning.',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '6',
    name: 'Ravi',
    avatarUrl: 'https://picsum.photos/seed/6/96/96',
    age: 30,
    gender: 'Male',
    email: 'ravi@example.com',
    isActive: true,
    bio: 'Building the future, one line of code at a time.',
    lastSeen: 'online',
  },
];

let channelsData: Channel[] = [
  { id: '1', name: 'general', adminId: '1', memberIds: ['1', '2', '3', '4', '6'] },
  { id: '2', name: 'design-team', adminId: '2', memberIds: ['2', '5'] },
  { id: '3', name: 'random', adminId: '1', memberIds: ['1', '3', '4'] },
];

let messages: Message[] = [
  // Channel 1: general
  {
    id: 'msg-ch1-1',
    channelId: '1',
    content: 'Hey everyone, welcome to the general channel!',
    timestamp: '2024-07-29T10:00:00Z',
    user: users[1],
  },
  {
    id: 'msg-ch1-2',
    channelId: '1',
    content: 'Glad to be here! How is everyone doing?',
    timestamp: '2024--07-29T10:01:00Z',
    user: users[2],
  },
  {
    id: 'msg-ch1-3',
    channelId: '1',
    content: 'Doing great, thanks! Ready for a productive day.',
    timestamp: '2024-07-29T10:02:00Z',
    user: users[0],
  },
  {
    id: 'msg-ch1-4',
    channelId: '1',
    content: 'Just a reminder, the weekly sync is at 3 PM today.',
    timestamp: '2024-07-29T10:05:00Z',
    user: users[3],
  },

  // Channel 2: design-team
  {
    id: 'msg-ch2-1',
    channelId: '2',
    content: 'Hey team, I pushed the latest wireframes to Figma.',
    timestamp: '2024-07-29T11:00:00Z',
    user: users[1],
  },
  {
    id: 'msg-ch2-2',
    channelId: '2',
    content: "Awesome, I'll take a look now. The new color palette looks great!",
    timestamp: '2024-07-29T11:02:00Z',
    user: users[4],
  },
  {
    id: 'msg-ch2-3',
    channelId: '2',
    content:
      'I have some feedback on the dashboard layout. I will leave comments directly in Figma.',
    timestamp: '2024-07-29T11:15:00Z',
    user: users[0],
  },

  // Channel 3: random
  {
    id: 'msg-ch3-1',
    channelId: '3',
    content: 'Anyone watch that new sci-fi movie on the weekend?',
    timestamp: '2024-07-29T12:00:00Z',
    user: users[2],
  },
  {
    id: 'msg-ch3-2',
    channelId: '3',
    content: 'Oh yeah, the one with the time travel? It was amazing!',
    timestamp: '2024-07-29T12:01:00Z',
    user: users[4],
  },

  // DM 1: Alex and Maya
  {
    id: 'msg-dm1-1',
    dmId: '1-2',
    content: 'Hey Maya, got a minute to chat about the Q3 report?',
    timestamp: '2024-07-29T14:00:00Z',
    user: users[0],
  },
  {
    id: 'msg-dm1-2',
    dmId: '1-2',
    content: "Sure Alex, what's up?",
    timestamp: '2024-07-29T14:00:30Z',
    user: users[1],
  },

  // DM 2: Alex and Leo
  {
    id: 'msg-dm2-1',
    dmId: '1-3',
    content: 'Hey Leo, are you free for lunch tomorrow?',
    timestamp: '2024-07-29T15:00:00Z',
    user: users[0],
  },
  {
    id: 'msg-dm2-2',
    dmId: '1-3',
    content: 'Yep, sounds good! Same place?',
    timestamp: '2024-07-29T15:01:00Z',
    user: users[2],
  },
];


const messageEmitter = new EventEmitter<Message[]>();
messageEmitter.subscribe(newMessages => {
  messages = newMessages;
});

const userEmitter = new EventEmitter<User[]>();
userEmitter.subscribe(newUsers => {
  users = newUsers;
});

const channelEmitter = new EventEmitter<Channel[]>();
channelEmitter.subscribe(newChannels => {
  channelsData = newChannels;
});

export function useChannels() {
    const [currentChannels, setChannels] = useState(channelsData);

    useEffect(() => {
        const unsubscribe = channelEmitter.subscribe(newChannels => {
          setChannels([...newChannels]);
        });
        setChannels(channelsData); 
        return () => unsubscribe();
    }, []);

    return currentChannels;
}

export function getChannels() {
    return channelsData;
}

export function addMessage(message: Message) {
  const newMessages = [...messages, message]
  messageEmitter.emit(newMessages);
}

export function clearMessagesForChannel(channelId: string) {
  const newMessages = messages.filter(m => m.channelId !== channelId);
  messageEmitter.emit(newMessages);
}

export function clearMessagesForDM(dmId: string) {
  const newMessages = messages.filter(m => m.dmId !== dmId);
  messageEmitter.emit(newMessages);
}

export function removeUserFromChannel(channelId: string, userId: string) {
    const newChannels = channelsData.map(c => {
        if (c.id === channelId) {
            return {
                ...c,
                memberIds: c.memberIds.filter(id => id !== userId),
            };
        }
        return c;
    });
    channelEmitter.emit(newChannels);
}


export function useMessages() {
    const [currentMessages, setMessages] = useState(messages);

    useEffect(() => {
        const unsubscribe = messageEmitter.subscribe(newMessages => {
          setMessages([...newMessages]);
        });
        setMessages(messages); 
        return () => unsubscribe();
    }, []);

    return currentMessages;
}

const CURRENT_USER_ID_KEY = 'aura-chat-current-user-id';
const NICKNAMES_KEY = 'aura-chat-nicknames';
const BLOCKED_USERS_KEY_PREFIX = 'aura-chat-blocked-users-';
const LAST_READ_KEY_PREFIX = 'aura-chat-last-read-';

// --- Nickname Functions ---
const getNicknames = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const stored = window.localStorage.getItem(NICKNAMES_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getUserNickname = (userId: string): string | undefined => {
  return getNicknames()[userId];
};

export const setUserNickname = (userId: string, nickname: string) => {
  if (typeof window === 'undefined') return;
  const nicknames = getNicknames();
  if (nickname.trim()) {
    nicknames[userId] = nickname.trim();
  } else {
    delete nicknames[userId]; // Remove nickname if it's empty
  }
  window.localStorage.setItem(NICKNAMES_KEY, JSON.stringify(nicknames));
  window.dispatchEvent(new CustomEvent('local-storage-changed')); // Notify components
};


export const setCurrentUserId = (userId: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CURRENT_USER_ID_KEY, userId);
    // Emit user change to update components that depend on the full user list
    window.dispatchEvent(new CustomEvent('local-storage-changed'));
  }
};

export const getCurrentUserId = (): string | null => {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem(CURRENT_USER_ID_KEY);
    }
    return null;
}

export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const storedId = getCurrentUserId();
    if (!storedId) return null;
    const user = users.find((u) => u.id === storedId);
    return user || null;
  }
  return null;
};

export const useCurrentUser = (): User | null => {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    const handleUserChange = () => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    };
    
    handleUserChange(); // Initial set
    
    // This custom event is fired when we call `setCurrentUserId` or `updateUser`.
    window.addEventListener('local-storage-changed', handleUserChange);
    // The 'storage' event is for changes in other tabs.
    window.addEventListener('storage', handleUserChange);

    const unsubscribeUsers = userEmitter.subscribe((newUsers) => {
        const currentId = getCurrentUserId();
        const updatedUser = newUsers.find(u => u.id === currentId);
        setUser(updatedUser || null);
    });

    return () => {
        window.removeEventListener('local-storage-changed', handleUserChange);
        window.removeEventListener('storage', handleUserChange);
        unsubscribeUsers();
    };
  }, []);

  return user;
}


export function addUser(user: Omit<User, 'id' | 'avatarUrl' | 'isActive' | 'bio' | 'lastSeen'>) {
    const newUser: User = {
        ...user,
        id: String(users.length + 1),
        avatarUrl: `https://picsum.photos/seed/${users.length + 1}/96/96`,
        isActive: true,
        bio: 'New to Aura Chat!',
        lastSeen: 'online',
    }
    const newUsers = [...users, newUser];
    userEmitter.emit(newUsers);
    return newUser;
}

export function updateUser(userId: string, updatedData: Partial<User>) {
    users = users.map(user => 
        user.id === userId ? { ...user, ...updatedData, id: user.id } : user
    );
    // Also update messages to reflect user changes
    messages = messages.map(message =>
      message.user.id === userId ? { ...message, user: { ...message.user, ...updatedData, id: message.user.id } } : message
    );

    // Notify all components about the update
    userEmitter.emit([...users]);
    messageEmitter.emit([...messages]);
    window.dispatchEvent(new CustomEvent('local-storage-changed'));
}

export const getUserById = (id: string) => {
    return users.find(u => u.id === id);
}

// --- Block Functions ---
const getBlockedUsersKey = () => {
    const currentUserId = getCurrentUserId();
    // Return a key that is specific to the logged-in user
    return `${BLOCKED_USERS_KEY_PREFIX}${currentUserId}`;
}

export const getBlockedUserIds = (): string[] => {
    if (typeof window === 'undefined') return [];
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return []; // No user logged in, no blocks
    const key = getBlockedUsersKey();
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
};

export const isUserBlocked = (userId: string): boolean => {
    return getBlockedUserIds().includes(userId);
};

export const blockUser = (userId: string) => {
    if (typeof window === 'undefined') return;
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    const blockedIds = getBlockedUserIds();
    if (!blockedIds.includes(userId)) {
        const newBlockedIds = [...blockedIds, userId];
        const key = getBlockedUsersKey();
        window.localStorage.setItem(key, JSON.stringify(newBlockedIds));
        window.dispatchEvent(new CustomEvent('local-storage-changed'));
    }
};

export const unblockUser = (userId: string) => {
    if (typeof window === 'undefined') return;
     const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    const blockedIds = getBlockedUserIds();
    const newBlockedIds = blockedIds.filter(id => id !== userId);
    const key = getBlockedUsersKey();
    window.localStorage.setItem(key, JSON.stringify(newBlockedIds));
    window.dispatchEvent(new CustomEvent('local-storage-changed'));
};

// Check if the current user is blocked by another user
export const isCurrentUserBlockedBy = (otherUserId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const otherUserBlockedKey = `${BLOCKED_USERS_KEY_PREFIX}${otherUserId}`;
    const stored = window.localStorage.getItem(otherUserBlockedKey);
    const otherUserBlockedIds = stored ? JSON.parse(stored) : [];
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return false;
    return otherUserBlockedIds.includes(currentUserId);
}

// --- Unread Message Functions ---
const getLastReadKey = () => {
    const currentUserId = getCurrentUserId();
    return `${LAST_READ_KEY_PREFIX}${currentUserId}`;
}

const getLastReadTimestamps = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    const key = getLastReadKey();
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : {};
}

export const markChatAsRead = (chatId: string) => {
    if (typeof window === 'undefined') return;
    const timestamps = getLastReadTimestamps();
    timestamps[chatId] = new Date().toISOString();
    const key = getLastReadKey();
    window.localStorage.setItem(key, JSON.stringify(timestamps));
    window.dispatchEvent(new CustomEvent('local-storage-changed')); // Notify sidebar
}

export const getUnreadMessageCount = (chatId: string, allMessages: Message[]): number => {
    if (typeof window === 'undefined') return 0;
    const currentUserId = getCurrentUserId();
    const lastReadTimestamp = getLastReadTimestamps()[chatId];
    
    const relevantMessages = allMessages.filter(m => 
        (m.channelId === chatId || m.dmId === chatId) && m.user.id !== currentUserId
    );

    if (!lastReadTimestamp) {
        return relevantMessages.length;
    }
    
    return relevantMessages.filter(m => 
        new Date(m.timestamp) > new Date(lastReadTimestamp)
    ).length;
};
