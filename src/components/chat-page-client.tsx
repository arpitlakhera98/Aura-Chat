
'use client';

import * as React from 'react';
import type { Message, User, Channel } from '@/lib/data';
import { addMessage, getUserNickname } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { SendHorizonal, Paperclip, X, Image as ImageIcon, Camera, FileText, MapPin, Contact, Mic, Smile, MoreVertical } from 'lucide-react';
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

interface ChatPageClientProps {
  currentUser: User;
  messages: Message[];
  chatTarget: User | Channel;
  isChannel: boolean;
}

export function ChatPageClient({
  currentUser,
  messages,
  chatTarget,
  isChannel,
}: ChatPageClientProps) {
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

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    const updateDisplayName = () => {
      if (!isChannel) {
        const nickname = getUserNickname(chatTarget.id);
        setDisplayName(nickname || chatTarget.name);
      }
    };
    updateDisplayName();

    window.addEventListener('local-storage-changed', updateDisplayName);
    return () => {
      window.removeEventListener('local-storage-changed', updateDisplayName);
    };
  }, [chatTarget, isChannel]);

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

  const handleBlockUser = () => {
    toast({
      title: 'User Blocked (Not Implemented)',
      description: `You have blocked ${(chatTarget as User).name}. This is a placeholder action.`,
    });
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
  
  if (!currentUser) {
    return <div>Loading chat...</div>;
  }

  const otherUser = isChannel ? null : (chatTarget as User);
  const status = otherUser
    ? otherUser.lastSeen === 'online'
      ? 'Online'
      : `Last seen ${formatLastSeen(otherUser.lastSeen)}`
    : null;

  return (
    <div className="flex h-screen flex-col bg-transparent relative">
        <header className="absolute top-0 left-0 right-0 z-10 p-4">
            <div className="mx-auto max-w-4xl flex items-center justify-between gap-4 rounded-full p-2 pl-4 bg-black/30 backdrop-blur-md border border-white/10 shadow-lg animate-aurora-glow">
                {isChannel ? (
                <div className="flex items-center gap-3 font-semibold">
                    <Avatar className="h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                        <span className="text-primary font-bold text-xl">#</span>
                    </Avatar>
                    <span className="text-lg">{displayName}</span>
                </div>
                ) : (
                <Link href={`/profile/${chatTarget.id}`} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/50">
                    <AvatarImage src={(chatTarget as User).avatarUrl} />
                    <AvatarFallback>{displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-base">{displayName}</span>
                        {status && <span className="text-xs text-primary">{status}</span>}
                    </div>
                </Link>
                )}
                 <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                                <MoreVertical className="h-5 w-5 text-muted-foreground" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black/80 border-white/10 text-white">
                            <DropdownMenuItem onClick={() => handlePlaceholderAction('Chat theme')}>
                                Chat theme
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePlaceholderAction('Share user')}>
                                Share user
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePlaceholderAction('Remove user')}>
                                Remove user
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handlePlaceholderAction('Clear chat')}>
                                Clear chat
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10"/>
                            <DropdownMenuItem onClick={handleBlockUser} className="text-red-400 focus:bg-red-500/20 focus:text-red-300">
                                Block chat
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>

      <main
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-6 space-y-2 pt-28 pb-28"
      >
        {messages.map((message, index) => {
           const prevMessage = messages[index - 1];
           const nextMessage = messages[index + 1];
           const isSender = message.user.id === currentUser.id;

           const showAvatar = !isSender && (!prevMessage || prevMessage.user.id !== message.user.id);
           const isFirstInGroup = !prevMessage || prevMessage.user.id !== message.user.id;
           const isLastInGroup = !nextMessage || nextMessage.user.id !== message.user.id;
           
          return (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-3 w-full',
                isSender ? 'justify-end' : 'justify-start'
              )}
            >
              {showAvatar ? (
                  <Avatar className="h-8 w-8 self-end mb-1">
                      <AvatarImage src={message.user.avatarUrl} />
                      <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                  </Avatar>
              ) : (
                !isSender && <div className="w-11" />
              )}
              <div
                className={cn(
                  'group relative max-w-md rounded-2xl px-4 py-2.5 text-base md:max-w-lg',
                  isSender
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-foreground rounded-bl-none animate-aurora-glow border border-white/10',
                   {'p-1.5': !!message.imageUrl}
                )}
              >
                {!isSender && isChannel && isFirstInGroup &&(
                  <p className="text-xs font-semibold pb-1 text-primary">{message.user.name}</p>
                )}
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
          )
        })}
      </main>

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
                <Button type="button" size="icon" className="bg-primary rounded-full h-10 w-10 hover:bg-primary/90">
                    <Mic className="h-5 w-5 text-primary-foreground" />
                </Button>
            )}
        </form>
        </div>
      </footer>
    </div>
  );
}
