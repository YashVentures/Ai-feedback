'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e8ebe6] text-[#0e0f0c] px-4 py-8">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white rounded-[24px] border border-[#d5dad2] shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0e0f0c]">
            Verify Your Account
          </h1>
          <p className="text-sm text-[#454745]">
            Enter the 6-digit code sent to your email address for <span className="font-bold text-[#0e0f0c]">@{params.username}</span>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-[#0e0f0c]">Verification Code</FormLabel>
                  <Input
                    {...field}
                    placeholder="123456"
                    className="h-12 rounded-xl border-[#d5dad2] focus:border-[#9fe870] text-center text-xl font-mono tracking-widest text-[#0e0f0c]"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-11 bg-[#9fe870] text-[#0e0f0c] hover:bg-[#cdffad] font-semibold text-base rounded-full shadow-none transition-colors border-0 mt-2"
            >
              Verify Code
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}