'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).map((m) => m.trim()).filter(Boolean);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { data: session } = useSession();

  const [completion, setCompletion] = useState(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestError(null);
    setCompletion('');
    try {
      const response = await fetch('/api/suggest-messages', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response body');
      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setCompletion(result);
      }
    } catch (err) {
      setSuggestError('Could not load suggestions. Please try again.');
      console.error(err);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-6 sm:my-10 px-4 sm:px-6 py-6 max-w-3xl">
      <div className="bg-white rounded-[24px] border border-[#d5dad2] p-6 sm:p-10 shadow-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-[#0e0f0c] tracking-tight">
            Send Anonymous Feedback
          </h1>
          <p className="text-sm sm:text-base text-[#454745]">
            Write a secret message to <span className="font-bold text-[#0e0f0c]">@{username}</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-[#0e0f0c]">Your Anonymous Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ask anything or share honest feedback..."
                      className="resize-none bg-[#e8ebe6] text-[#0e0f0c] border border-[#d5dad2] focus:border-[#9fe870] rounded-xl p-4 text-base min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="bg-[#9fe870] text-[#0e0f0c] rounded-full px-8 py-3 font-semibold opacity-70">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="bg-[#9fe870] text-[#0e0f0c] hover:bg-[#cdffad] rounded-full px-10 py-3 font-semibold text-base shadow-none transition-colors border-0"
                >
                  Send Anonymous Message
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="space-y-4 pt-4 border-t border-[#e8ebe6]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#0e0f0c]">Need Inspiration?</h3>
              <p className="text-xs text-[#868685]">Click any AI suggestion below to insert it into your message.</p>
            </div>
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="bg-[#e2f6d5] text-[#054d28] hover:bg-[#c5edab] rounded-full px-5 py-2 font-semibold text-xs border-0 shadow-none transition-colors"
            >
              {isSuggestLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                '✨ AI Suggestions'
              )}
            </Button>
          </div>

          <div className="space-y-2 pt-2">
            {suggestError ? (
              <p className="text-xs text-[#d03238] font-medium">{suggestError}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left bg-[#e8ebe6] hover:bg-[#d5dad2] text-[#0e0f0c] rounded-[16px] p-4 text-sm font-medium transition-colors border border-transparent hover:border-[#9fe870] leading-snug"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-[#e8ebe6] text-center">
          {session ? (
            <Link href="/dashboard">
              <Button className="bg-[#e8ebe6] text-[#0e0f0c] hover:bg-[#d5dad2] rounded-full font-semibold px-6 py-2 text-sm border-0 shadow-none">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-[#454745]">Want your own anonymous message board?</p>
              <Link href="/sign-up">
                <Button className="bg-[#0e0f0c] text-[#9fe870] hover:bg-[#163300] rounded-full font-semibold px-8 py-3 text-sm border-0 shadow-none transition-colors">
                  Create Your Free Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
