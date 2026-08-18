'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-6 sm:my-10 mx-auto px-4 sm:px-6 py-6 w-full max-w-5xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0e0f0c]">
          User Dashboard
        </h1>
        <p className="text-base text-[#454745]">Manage your anonymous feedback link and received messages.</p>
      </div>

      {/* Share Profile Link Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-[#d5dad2] shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#0e0f0c]">Your Shareable Profile Link</h2>
          <p className="text-sm text-[#868685]">Share this link with anyone to receive anonymous feedback.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full bg-[#e8ebe6] text-[#0e0f0c] border border-[#d5dad2] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none select-all truncate"
          />
          <Button
            onClick={copyToClipboard}
            className="sm:shrink-0 bg-[#9fe870] text-[#0e0f0c] hover:bg-[#cdffad] rounded-full font-semibold px-6 py-3 border-0 shadow-none transition-colors"
          >
            Copy Link
          </Button>
        </div>
      </div>

      {/* Settings Bar */}
      <div className="bg-white p-6 rounded-[24px] border border-[#d5dad2] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="text-sm font-semibold text-[#0e0f0c]">
            Accept Messages: <strong className={acceptMessages ? 'text-[#2ead4b]' : 'text-[#d03238]'}>{acceptMessages ? 'Active' : 'Paused'}</strong>
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="text-sm font-medium text-[#868685]">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="bg-[#e8ebe6] text-[#0e0f0c] hover:bg-[#d5dad2] rounded-full font-semibold px-4 py-2 text-xs transition-colors border-0 shadow-none"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Messages Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#0e0f0c]">Inbox</h2>
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[24px] border border-[#d5dad2] text-center space-y-3 shadow-sm">
            <p className="text-lg font-semibold text-[#0e0f0c]">No messages yet!</p>
            <p className="text-sm text-[#868685] max-w-sm mx-auto">
              Share your link on social media or with friends to start getting anonymous notes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;