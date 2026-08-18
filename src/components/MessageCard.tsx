'use client';

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    } 
  };

  return (
    <Card className="bg-white border border-[#d5dad2] rounded-[24px] shadow-sm p-6 transition-all hover:border-[#9fe870]">
      <CardHeader className="p-0">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-base font-medium leading-relaxed break-words min-w-0 text-[#0e0f0c]">
            {message.content}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-9 w-9 bg-[#fef2f2] text-[#d03238] hover:bg-[#fee2e2] hover:text-[#a72027] rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white rounded-[24px] border border-[#d5dad2] p-6 max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold text-[#0e0f0c]">
                  Delete Message?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-[#454745]">
                  This action cannot be undone. This note will be permanently removed from your feedback board.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="pt-4 flex gap-2">
                <AlertDialogCancel className="bg-[#e8ebe6] text-[#0e0f0c] hover:bg-[#d5dad2] rounded-full font-semibold px-5 border-0 shadow-none">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-[#d03238] text-white hover:bg-[#a72027] rounded-full font-semibold px-5 border-0 shadow-none"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-xs font-medium text-[#868685] pt-2">
          {dayjs(message.createdAt).format('MMM D, YYYY • h:mm A')}
        </div>
      </CardHeader>
      <CardContent className="p-0"></CardContent>
    </Card>
  );
}
