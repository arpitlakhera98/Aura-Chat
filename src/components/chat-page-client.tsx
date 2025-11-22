
'use client';

import * as React from 'react';
import type { Message, User, Channel } from '@/lib/data';
import { addMessage, getUserNickname, setUserNickname, blockUser, removeUserFromChannel, users, addUsersToChannel, updateChannel, getUserById } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { SendHorizonal, Paperclip, X, Image as ImageIcon, Camera, FileText, MapPin, Contact, Mic, Smile, MoreVertical, Edit2, Sparkles, Trash2, ShieldBan, UserCog, UserPlus, LogOut, UserX, Eye } from 'lucide-react';
import { cn, formatLastSeen } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { SummarizeDialog } from './summarize-dialog';
import { useRouter } from 'next/navigation';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';


function AddMemberDialog({
  channel,
  open,
  onOpenChange,
}: {
  channel: Channel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [potentialMembers, setPotentialMembers] = React.useState<User[]>([]);

  React.useEffect(() => {
    if (open) {
      const nonMembers = users.filter(user => !channel.memberIds.includes(user.id));
      setPotentialMembers(nonMembers);
      setSelectedUsers([]);
    }
  }, [open, channel.memberIds]);
  
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleAddMembers = () => {
    const totalMembers = channel.memberIds.length + selectedUsers.length;
    if (totalMembers > 5) {
      toast({
        variant: 'destructive',
        title: 'Group is Full',
        description: `You can only add ${5 - channel.memberIds.length} more members.`,
      });
      return;
    }

    addUsersToChannel(channel.id, selectedUsers);
    toast({
      title: 'Members Added',
      description: `${selectedUsers.length} user(s) have been added to #${channel.name}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black/80 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Add Members to #{channel.name}</DialogTitle>
          <DialogDescription>
            Select users to add to this channel. A channel can have a maximum of 5 members.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-64 mt-4 pr-4">
          <div className="space-y-4">
            {potentialMembers.length > 0 ? (
              potentialMembers.map(user => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/10 cursor-pointer"
                onClick={() => handleSelectUser(user.id)}
              >
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => handleSelectUser(user.id)}
                  id={`user-${user.id}`}
                />
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))
            ) : (
                <p className="text-center text-muted-foreground py-10">No other users to add.</p>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddMembers} disabled={selectedUsers.length === 0}>
            Add ({selectedUsers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const DUMMY_AVATAR_URL = 'https://picsum.photos/seed/placeholder/96/96';

function EditChannelDialog({
  channel,
  open,
  onOpenChange,
}: {
  channel: Channel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [name, setName] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [avatarPreview, setAvatarPreview] = React.useState('');

  React.useEffect(() => {
    if (channel) {
      setName(channel.name);
      const url = channel.avatarUrl || DUMMY_AVATAR_URL;
      setAvatarUrl(url);
      setAvatarPreview(url);
    }
  }, [channel]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (!channel) return;

    updateChannel(channel.id, {
      name,
      avatarUrl,
    });

    toast({
      title: 'Channel Updated',
      description: 'The channel details have been saved.',
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black/80 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Edit Channel</DialogTitle>
          <DialogDescription>
            Change the name and avatar for #{channel.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback>#</AvatarFallback>
                </Avatar>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Change Icon
                </Button>
            </div>
            <div className="space-y-2">
                <Label htmlFor="channel-name">Channel Name</Label>
                <Input
                    id="channel-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/20 border-white/10"
                />
            </div>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


interface ChatPageClientProps {
  currentUser: User;
  messages: Message[];
  chatTarget: User | Channel;
  isChannel: boolean;
  onClearChat?: () => void;
}

const ChannelMembersPopover = ({
  channel,
  currentUser,
}: {
  channel: Channel;
  currentUser: User;
}) => {
  const [members, setMembers] = React.useState<User[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const [userToRemove, setUserToRemove] = React.useState<User | null>(null);
  const [userToBlock, setUserToBlock] = React.useState<User | null>(null);

  React.useEffect(() => {
    const memberDetails = channel.memberIds
      .map((id) => getUserById(id))
      .filter((user): user is User => !!user);
    setMembers(memberDetails);
  }, [channel.memberIds]);

  const isAdmin = channel.adminId === currentUser.id;

  const handleRemoveClick = (member: User) => {
    setUserToRemove(member);
  };

  const handleBlockClick = (member: User) => {
    setUserToBlock(member);
  };

  const confirmRemoveUser = () => {
    if (userToRemove) {
      removeUserFromChannel(channel.id, userToRemove.id);
      toast({
        title: 'User Removed',
        description: `${userToRemove.name} has been removed from the channel.`,
      });
      setUserToRemove(null);
    }
  };
  
  const confirmBlockUser = () => {
    if (userToBlock) {
      blockUser(userToBlock.id);
      toast({
        variant: 'destructive',
        title: 'User Blocked',
        description: `You have blocked ${userToBlock.name}.`,
      });
      setUserToBlock(null);
    }
  };


  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar className="h-10 w-10 flex items-center justify-center bg-muted rounded-full">
              <AvatarImage src={channel.avatarUrl} />
              <AvatarFallback>#</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-lg font-semibold">{channel.name}</span>
              <p className="text-xs text-muted-foreground">
                {channel.memberIds.length} members
              </p>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-black/80 border-white/10 text-white">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Members</h4>
              <p className="text-sm text-muted-foreground">
                Users in this channel.
              </p>
            </div>
            <ScrollArea className="h-48">
              <div className="space-y-1 pr-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-white/10 group"
                  >
                    <Link
                      href={`/profile/${member.id}`}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium hover:underline">
                        {member.name}
                      </span>
                      {member.id === channel.adminId && (
                        <span className="text-xs text-primary">(Admin)</span>
                      )}
                    </Link>
                    {member.id !== currentUser.id && (
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black/80 border-white/10 text-white">
                            <DropdownMenuItem onClick={() => router.push(`/profile/${member.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                            </DropdownMenuItem>
                            {isAdmin && member.id !== channel.adminId && (
                                <DropdownMenuItem onClick={() => handleRemoveClick(member)}>
                                    <UserX className="mr-2 h-4 w-4 text-red-400" />
                                    <span className="text-red-400">Remove from Channel</span>
                                </DropdownMenuItem>
                            )}
                             <DropdownMenuItem onClick={() => handleBlockClick(member)}>
                                <ShieldBan className="mr-2 h-4 w-4 text-red-400" />
                                <span className="text-red-400">Block User</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Remove User Dialog */}
      <AlertDialog open={!!userToRemove} onOpenChange={(open) => !open && setUserToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {userToRemove?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {userToRemove?.name} from this channel? They will need to be invited back.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveUser} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block User Dialog */}
      <AlertDialog open={!!userToBlock} onOpenChange={(open) => !open && setUserToBlock(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block {userToBlock?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Blocked users will not be able to send you messages. This contact will not be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBlockUser} className="bg-destructive hover:bg-destructive/90">Block</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};


export function ChatPageClient({
  currentUser,
  messages,
  chatTarget,
  isChannel,
  onClearChat,
}: ChatPageClientProps) {
  const router = useRouter();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const documentInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [newMessage, setNewMessage] = React.useState('');
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [showCamera, setShowCamera] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState(true);
  const { toast } = useToast();
  const [displayName, setDisplayName] = React.useState(chatTarget.name);
  const [nicknameInput, setNicknameInput] = React.useState('');
  const [isNicknameDialogOpen, setIsNicknameDialogOpen] = React.useState(false);
  const [isClearChatDialogOpen, setIsClearChatDialogOpen] = React.useState(false);
  const [isBlockUserDialogOpen, setIsBlockUserDialogOpen] = React.useState(false);
  const [isLeaveChannelOpen, setIsLeaveChannelOpen] = React.useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);
  const [isEditChannelOpen, setIsEditChannelOpen] = React.useState(false);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const updateDisplayName = React.useCallback(() => {
    if (!isChannel) {
      const nickname = getUserNickname(chatTarget.id);
      setDisplayName(nickname || chatTarget.name);
    } else {
        setDisplayName(chatTarget.name);
    }
  }, [chatTarget, isChannel]);

  React.useEffect(() => {
    updateDisplayName();

    window.addEventListener('local-storage-changed', updateDisplayName);
    return () => {
      window.removeEventListener('local-storage-changed', updateDisplayName);
    };
  }, [updateDisplayName, chatTarget]);

  React.useEffect(() => {
    if (showCamera) {
        const getCameraPermission = async () => {
          try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera not supported');
            }
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            setHasCameraPermission(true);

            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
          }
        };

        getCameraPermission();
    } else {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [showCamera, toast]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((newMessage.trim() === '' && !imagePreview) || !currentUser) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      imageUrl: imagePreview || undefined,
      timestamp: new Date().toISOString(),
      user: currentUser,
    };
    
    if (isChannel) {
        message.channelId = chatTarget.id;
    } else {
        message.dmId = [currentUser.id, (chatTarget as User).id].sort().join('-');
    }

    addMessage(message);
    setNewMessage('');
    setImagePreview(null);
  };
  
  const confirmClearChat = () => {
    if(onClearChat) {
        onClearChat();
    }
    toast({
        title: "Chat Cleared",
        description: "All messages in this chat have been deleted."
    })
    setIsClearChatDialogOpen(false);
  }

  const confirmBlockUser = () => {
    if (isChannel) return;
    blockUser(chatTarget.id);
    toast({
      variant: 'destructive',
      title: 'User Blocked',
      description: `You have blocked ${displayName}. They will no longer be able to message you or see your profile.`,
    });
    setIsBlockUserDialogOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: 'Document Selected',
        description: `${file.name} is ready to be sent. (Feature not fully implemented)`,
      });
    }
  };

  const handleAttachImageClick = () => {
    imageInputRef.current?.click();
  };
  
  const handleAttachDocumentClick = () => {
    documentInputRef.current?.click();
  };

  const handleCameraClick = () => {
    setShowCamera(prev => !prev);
  }
  
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: 'Location Shared',
            description: `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)} (Feature not fully implemented)`,
          });
        },
        (error) => {
          toast({
            variant: 'destructive',
            title: 'Location Access Denied',
            description: 'Please enable location permissions to use this feature.',
          });
        }
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
      });
    }
  };

    const handlePlaceholderAction = (action: string) => {
        toast({
            title: 'Feature Not Implemented',
            description: `The "${action}" feature is not yet supported.`,
        });
    };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) {
        imageInputRef.current.value = '';
    }
  }

  const handlePlaceholderAttachment = (type: string) => {
    toast({
        title: 'Feature Not Implemented',
        description: `Attaching a ${type} is not yet supported.`,
    });
  }

  const openNicknameDialog = () => {
    if (isChannel) return;
    const nickname = getUserNickname(chatTarget.id);
    setNicknameInput(nickname || '');
    setIsNicknameDialogOpen(true);
  }

  const handleNicknameSave = () => {
    if (isChannel) return;
    setUserNickname(chatTarget.id, nicknameInput);
    updateDisplayName(); // Directly call the update function
    setIsNicknameDialogOpen(false);
    toast({
        title: "Nickname Updated",
        description: `The nickname for ${chatTarget.name} has been set.`,
    });
  };

  const handleLeaveChannel = () => {
      if (!isChannel) return;
      removeUserFromChannel(chatTarget.id, currentUser.id);
      setIsLeaveChannelOpen(false);
      toast({
          title: "You have left the channel",
          description: `You are no longer a member of #${(chatTarget as Channel).name}.`,
      });
      router.push('/channel/1'); // Redirect to a default channel
  }
  
  if (!currentUser || !chatTarget) {
    return <div className="flex h-full items-center justify-center"><p>Loading chat...</p></div>;
  }

  const otherUser = isChannel ? null : (chatTarget as User);
  const channel = isChannel ? (chatTarget as Channel) : null;
  const status = channel
    ? null // Status is now handled by the Popover trigger
    : otherUser?.lastSeen === 'online'
      ? 'Online'
      : `Last seen ${formatLastSeen(otherUser!.lastSeen)}`;


  const isAdmin = channel && channel.adminId === currentUser.id;

  return (
    <div className="flex h-screen flex-col bg-transparent relative">
        {channel && <AddMemberDialog channel={channel} open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen} />}
        {channel && isAdmin && <EditChannelDialog channel={channel} open={isEditChannelOpen} onOpenChange={setIsEditChannelOpen} />}
        <header className="absolute top-0 left-0 right-0 z-10 p-4">
            <div className="mx-auto max-w-4xl flex items-center justify-between gap-4 rounded-full p-2 pl-4 bg-black/30 backdrop-blur-md border border-white/10 shadow-lg animate-aurora-glow">
                {channel ? (
                    <ChannelMembersPopover channel={channel} currentUser={currentUser} />
                ) : (
                <div className="flex items-center gap-4">
                    <Link href={`/profile/${chatTarget.id}`}>
                        <Avatar className="h-12 w-12 border-2 border-primary/50">
                        <AvatarImage src={(chatTarget as User).avatarUrl} />
                        <AvatarFallback>{displayName[0]}</AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                           <span className="font-semibold text-base">{displayName}</span>
                           <Button variant="ghost" size="icon" onClick={openNicknameDialog} className="h-6 w-6">
                               <Edit2 className="h-3 w-3" />
                           </Button>
                        </div>
                        {status && <span className="text-xs text-primary">{status}</span>}
                    </div>
                </div>
                )}
                 <div className="ml-auto flex items-center gap-2">
                    <SummarizeDialog messages={messages} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                                <MoreVertical className="h-5 w-5 text-muted-foreground" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black/80 border-white/10 text-white">
                            {!isChannel && <DropdownMenuItem onClick={openNicknameDialog}>Edit Nickname</DropdownMenuItem>}
                            {channel && isAdmin && (
                                <DropdownMenuItem onClick={() => setIsAddMemberOpen(true)} className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Add members
                                </DropdownMenuItem>
                            )}
                            {isAdmin && (
                                <DropdownMenuItem onClick={() => setIsEditChannelOpen(true)} className="flex items-center gap-2">
                                    <UserCog className="h-4 w-4" />
                                    Edit channel
                                </DropdownMenuItem>
                            )}
                            {isAdmin && <DropdownMenuSeparator className="bg-white/10"/>}
                            <DropdownMenuItem onClick={() => setIsClearChatDialogOpen(true)} className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Clear chat
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10"/>
                             {!isChannel && (
                                <DropdownMenuItem onClick={() => setIsBlockUserDialogOpen(true)} className="text-red-400 focus:bg-red-500/20 focus:text-red-300 flex items-center gap-2">
                                    <ShieldBan className="h-4 w-4" />
                                    Block user
                                </DropdownMenuItem>
                            )}
                            {channel && (
                                <DropdownMenuItem onClick={() => setIsLeaveChannelOpen(true)} className="text-red-400 focus:bg-red-500/20 focus:text-red-300 flex items-center gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Leave channel
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>

      <main
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-6 space-y-2 pt-28 pb-28"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
            messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const nextMessage = messages[index + 1];
            const isSender = message.user.id === currentUser.id;

            const isFirstInGroup = !prevMessage || prevMessage.user.id !== message.user.id || new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 60000 * 5;
            const isLastInGroup = !nextMessage || nextMessage.user.id !== message.user.id || new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime() > 60000 * 5;

            const showAvatar = !isSender && isLastInGroup;
            
            return (
                <div
                key={message.id}
                className={cn(
                    'flex items-end gap-3 w-full',
                    isSender ? 'justify-end' : 'justify-start'
                )}
                >
                {showAvatar ? (
                    <Link href={`/profile/${message.user.id}`}>
                        <Avatar className="h-8 w-8 self-end mb-1">
                            <AvatarImage src={message.user.avatarUrl} />
                            <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                        </Avatar>
                    </Link>
                ) : (
                    !isSender && <div className="w-11" />
                )}
                <div className="flex flex-col items-start gap-1 w-full max-w-md md:max-w-lg">
                    {!isSender && isChannel && isFirstInGroup && (
                        <p className="text-xs font-semibold text-primary ml-4">{message.user.name}</p>
                    )}
                    <div
                        className={cn(
                        'group relative rounded-2xl px-4 py-2.5 text-base',
                        isSender
                            ? 'bg-primary text-primary-foreground self-end'
                            : 'bg-muted text-foreground animate-aurora-glow border border-white/10',
                        isFirstInGroup && (isSender ? 'rounded-tr-none' : 'rounded-tl-none'),
                        isLastInGroup && (isSender ? 'rounded-br-none' : 'rounded-bl-none'),
                        {'p-1.5': !!message.imageUrl}
                        )}
                    >
                        
                        {message.imageUrl ? (
                        <Image src={message.imageUrl} alt="Sent image" width={300} height={200} className="rounded-lg" />
                        ) : (
                        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        )}
                        {message.imageUrl && message.content && (
                            <p className="pt-2">{message.content}</p>
                        )}
                        <p className="text-xs text-muted-foreground/80 float-right ml-4 mt-1 clear-both">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                </div>
            )
            })
        )}
      </main>
      <AlertDialog open={isNicknameDialogOpen} onOpenChange={setIsNicknameDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Edit Nickname</AlertDialogTitle>
              <AlertDialogDescription>
                  Set a local nickname for {chatTarget.name}. This will only be visible to you.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                  <Label htmlFor="nickname-dialog">Nickname</Label>
                  <Input 
                      id="nickname-dialog"
                      value={nicknameInput}
                      onChange={(e) => setNicknameInput(e.target.value)}
                      placeholder="Enter nickname"
                  />
              </div>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleNicknameSave}>Save</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isClearChatDialogOpen} onOpenChange={setIsClearChatDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all messages in this conversation.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmClearChat} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Yes, clear chat
              </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

       <AlertDialog open={isBlockUserDialogOpen} onOpenChange={setIsBlockUserDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Block {displayName}?</AlertDialogTitle>
              <AlertDialogDescription>
                  Blocked contacts will no longer be able to call you or send you messages. This contact will not be notified.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmBlockUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Block
              </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isLeaveChannelOpen} onOpenChange={setIsLeaveChannelOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Leave #{channel?.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                  You will no longer receive notifications from this channel and it will be removed from your channel list.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLeaveChannel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Leave
              </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

      <footer className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 rounded-full p-2 bg-black/30 backdrop-blur-md border border-white/10 shadow-lg animate-aurora-glow">
            <Popover>
                <PopoverTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full">
                        <Smile className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-2 bg-black/80 border-white/10 text-white">
                    <p>Emoji picker placeholder</p>
                </PopoverContent>
            </Popover>
           
             <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
               <input
                type="file"
                ref={documentInputRef}
                onChange={handleDocumentChange}
                className="hidden"
              />
              <Popover>
                <PopoverTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full">
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Attach file</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-2 mb-2 bg-black/80 border-white/10" side="top" align="start">
                    <div className="grid grid-cols-3 gap-2">
                       <Button variant="outline" size="icon" className="h-14 w-14 flex-col gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleAttachImageClick}>
                            <ImageIcon className="h-6 w-6 text-primary" />
                            <span className="text-xs">Image</span>
                       </Button>
                       <Button variant="outline" size="icon" className="h-14 w-14 flex-col gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleCameraClick}>
                            <Camera className="h-6 w-6 text-primary" />
                            <span className="text-xs">Camera</span>
                       </Button>
                       <Button variant="outline" size="icon" className="h-14 w-14 flex-col gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleAttachDocumentClick}>
                            <FileText className="h-6 w-6 text-primary" />
                            <span className="text-xs">Document</span>
                       </Button>
                       <Button variant="outline" size="icon" className="h-14 w-14 flex-col gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleLocationClick}>
                            <MapPin className="h-6 w-6 text-primary" />
                            <span className="text-xs">Location</span>
                       </Button>
                        <Button variant="outline" size="icon" className="h-14 w-14 flex-col gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => handlePlaceholderAttachment('contact')}>
                            <Contact className="h-6 w-6 text-primary" />
                            <span className="text-xs">Contact</span>
                       </Button>
                    </div>
                </PopoverContent>
              </Popover>

            <div className="flex-1 relative">
             {imagePreview && (
                <div className="p-2 absolute bottom-full bg-card w-full rounded-t-md">
                    <div className="relative w-fit">
                        <Image src={imagePreview} alt="Image preview" width={80} height={80} className="rounded-md" />
                         <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-muted text-muted-foreground" onClick={handleRemoveImage}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
             {showCamera && (
                <div className="p-2 absolute bottom-full bg-card w-full rounded-t-md">
                    <div className="relative">
                        <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted />
                        {!hasCameraPermission && (
                             <Alert variant="destructive" className="mt-2">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>
                                    Please allow camera access in your browser settings to use this feature.
                                </AlertDescription>
                            </Alert>
                        )}
                         <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6" onClick={() => setShowCamera(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
              <input
                placeholder="Type a message"
                className="bg-transparent w-full border-none focus:ring-0 focus:outline-none text-white placeholder:text-muted-foreground"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            {newMessage.trim() || imagePreview ? (
                 <Button type="submit" size="icon" className="rounded-full bg-primary h-10 w-10 transition-transform hover:scale-110">
                  <SendHorizonal className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
            ) : (
                <Button type="button" size="icon" className="bg-primary rounded-full h-10 w-10 hover:bg-primary/90" onClick={() => handlePlaceholderAction('Voice message')}>
                    <Mic className="h-5 w-5 text-primary-foreground" />
                </Button>
            )}
        </form>
        </div>
      </footer>
    </div>
  );
}
