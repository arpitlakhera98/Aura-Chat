export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  email: string;
};

export type Channel = {
  id: string;
  name: string;
};

export type Message = {
  id: string;
  content: string;
  timestamp: string;
  user: User;
  channelId?: string;
  dmId?: string;
};

export const users: User[] = [
  {
    id: '1',
    name: 'Alex',
    avatarUrl: 'https://picsum.photos/seed/1/40/40',
    age: 28,
    gender: 'Male',
    email: 'alex@example.com',
  },
  {
    id: '2',
    name: 'Maya',
    avatarUrl: 'https://picsum.photos/seed/2/40/40',
    age: 32,
    gender: 'Female',
    email: 'maya@example.com',
  },
  {
    id: '3',
    name: 'Leo',
    avatarUrl: 'https://picsum.photos/seed/3/40/40',
    age: 25,
    gender: 'Male',
    email: 'leo@example.com',
  },
  {
    id: '4',
    name: 'Chloe',
    avatarUrl: 'https://picsum.photos/seed/4/40/40',
    age: 29,
    gender: 'Female',
    email: 'chloe@example.com',
  },
  {
    id: '5',
    name: 'Ben',
    avatarUrl: 'https://picsum.photos/seed/5/40/40',
    age: 35,
    gender: 'Male',
    email: 'ben@example.com',
  },
  {
    id: '6',
    name: 'Ravi',
    avatarUrl: 'https://picsum.photos/seed/6/40/40',
    age: 30,
    gender: 'Male',
    email: 'ravi@example.com',
  },
];

export const channels: Channel[] = [
  { id: '1', name: 'general' },
  { id: '2', name: 'design-team' },
  { id: '3', name: 'random' },
];

export const messages: Message[] = [
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
    timestamp: '2024-07-29T10:01:00Z',
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

export const getCurrentUser = () => users[0]; // Alex is the logged in user

export function addUser(user: Omit<User, 'id' | 'avatarUrl'>) {
    const newUser: User = {
        ...user,
        id: String(users.length + 1),
        avatarUrl: `https://picsum.photos/seed/${users.length + 1}/40/40`,
    }
    users.push(newUser);
    return newUser;
}
