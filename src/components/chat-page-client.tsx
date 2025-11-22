

'use client';

import * as React from 'react';
import type { Message, User, Channel } from '@/lib/data';
import { addMessage } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { SendHorizonal, Hash, ShieldX, Paperclip, X, Image as ImageIcon, Camera, FileText, MapPin, Contact } from 'lucide-react';
import { cn, formatLastSeen } from '@/lib/utils';
import { SummarizeDialog } from './summarize-dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

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
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [newMessage, setNewMessage] = React.useState('');
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [showCamera, setShowCamera] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
        // Stop camera stream when not shown
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

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleCameraClick = () => {
    setShowCamera(prev => !prev);
  }

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
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
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b bg-card px-4">
        {isChannel ? (
          <div className="flex items-center gap-3 font-semibold">
            <Hash className="h-6 w-6 text-muted-foreground" />
            <span className="text-lg">{chatTarget.name}</span>
          </div>
        ) : (
          <Link href={`/profile/${chatTarget.id}`} className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={(chatTarget as User).avatarUrl} />
              <AvatarFallback>{(chatTarget as User).name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-semibold text-base">{chatTarget.name}</span>
                {status && <span className="text-xs text-muted-foreground">{status}</span>}
            </div>
          </Link>
        )}
        <div className="ml-auto flex items-center gap-2">
          {isChannel && <SummarizeDialog messages={messages} />}
          {!isChannel && (
            <Button variant="ghost" size="icon" onClick={handleBlockUser}>
              <ShieldX className="h-4 w-4" />
              <span className="sr-only">Block User</span>
            </Button>
          )}
        </div>
      </header>

      <main
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-end gap-2',
              message.user.id === currentUser.id ? 'justify-end' : ''
            )}
          >
            {message.user.id !== currentUser.id && (
               <Link href={`/profile/${message.user.id}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage asChild src={message.user.avatarUrl}>
                    <Image src={message.user.avatarUrl} alt={message.user.name} width={32} height={32} />
                  </AvatarImage>
                  <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                </Avatar>
              </Link>
            )}
            <div
              className={cn(
                'max-w-xs rounded-lg p-3 text-sm md:max-w-md',
                message.user.id === currentUser.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card',
                {'p-1': !!message.imageUrl}
              )}
            >
              {message.user.id !== currentUser.id && (
                <p className="text-xs font-semibold pb-1 px-2">{message.user.name}</p>
              )}
              {message.imageUrl ? (
                <Image src={message.imageUrl} alt="Sent image" width={300} height={200} className="rounded-md" />
              ) : (
                <p>{message.content}</p>
              )}
               {message.imageUrl && message.content && (
                  <p className="pt-2 px-2">{message.content}</p>
              )}
            </div>
             {message.user.id === currentUser.id && (
               <Link href={`/profile/${message.user.id}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage asChild src={message.user.avatarUrl}>
                    <Image src={message.user.avatarUrl} alt={message.user.name} width={32} height={32} />
                  </AvatarImage>
                  <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        ))}
      </main>

      <footer className="border-t p-4 bg-card">
        <form onSubmit={handleSendMessage}>
          <Card>
            {imagePreview && (
                <div className="p-2 relative">
                    <Image src={imagePreview} alt="Image preview" width={80} height={80} className="rounded-md" />
                     <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6" onClick={handleRemoveImage}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            {showCamera && (
                <div className="p-2 relative">
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
            )}
            <div className="relative">
              <Textarea
                placeholder="Type your message..."
                className="resize-none pr-20"
                rows={1}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex gap-1">
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="icon">
                            <Paperclip className="h-4 w-4" />
                            <span className="sr-only">Attach file</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-2">
                        <div className="grid grid-cols-3 gap-2">
                           <Button variant="outline" size="icon" className="h-14 w-14 flex-col gap-1" onClick={handleAttachClick}>
                                <ImageIcon className="h-6 w-6" />
                                <span className="text-xs">Image</span>
                           </Button>
                           <Button variant="outline" size="icon" className="h-14 w-14 flex-col gap-1" onClick={handleCameraClick}>
                                <Camera className="h-6 w-6" />
                                <span className="text-xs">Camera</span>
                           </Button>
                           <Button variant="outline" size="icon" className="h-14 w-14 flex-col gap-1" onClick={() => handlePlaceholderAttachment('document')}>
                                <FileText className="h-6 w-6" />
                                <span className="text-xs">Document</span>
                           </Button>
                           <Button variant="outline" size="icon" className="h-14 w-14 flex-col gap-1" onClick={() => handlePlaceholderAttachment('location')}>
                                <MapPin className="h-6 w-6" />
                                <span className="text-xs">Location</span>
                           </Button>
                            <Button variant="outline" size="icon" className="h-14 w-14 flex-col gap-1" onClick={() => handlePlaceholderAttachment('contact')}>
                                <Contact className="h-6 w-6" />
                                <span className="text-xs">Contact</span>
                           </Button>
                        </div>
                    </PopoverContent>
                  </Popover>

                <Button
                  type="submit"
                  size="icon"
                >
                  <SendHorizonal className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </footer>
    </div>
  );
}
