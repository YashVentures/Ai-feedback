'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

import { useDebounce } from 'react-use';


export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  // Debounce username change
  const checkUsernameUnique = async () => {
    if (username) {
      setIsCheckingUsername(true);
      setUsernameMessage(''); // Reset message
      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${username}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? 'Error checking username'
        );
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };

  // Using useDebounce to debounce the username checking logic
  useDebounce(
    () => {
      checkUsernameUnique();
    },
    300,
    [username] // Dependencies array
  );

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage = axiosError.response?.data.message || 'Sign-up failed';

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e8ebe6] text-[#0e0f0c] px-4 py-8">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white rounded-[24px] border border-[#d5dad2] shadow-sm">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-black text-[#0e0f0c] tracking-tight mb-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#9fe870] inline-block" />
            <span>True Feedback</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0e0f0c]">
            Join True Feedback
          </h1>
          <p className="text-sm text-[#454745]">Create your account to start getting anonymous notes</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-[#0e0f0c]">Username</FormLabel>
                  <Input
                    {...field}
                    className="h-11 rounded-xl border-[#d5dad2] focus:border-[#9fe870] text-base"
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin h-4 w-4 text-[#868685] mt-1" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-xs font-semibold ${
                        usernameMessage === 'Username is unique'
                          ? 'text-[#2ead4b]'
                          : 'text-[#d03238]'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-[#0e0f0c]">Email Address</FormLabel>
                  <Input {...field} name="email" className="h-11 rounded-xl border-[#d5dad2] focus:border-[#9fe870] text-base" />
                  <p className="text-xs text-[#868685]">We will send you an OTP verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-[#0e0f0c]">Password</FormLabel>
                  <Input type="password" {...field} name="password" className="h-11 rounded-xl border-[#d5dad2] focus:border-[#9fe870] text-base" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-11 bg-[#9fe870] text-[#0e0f0c] hover:bg-[#cdffad] font-semibold text-base rounded-full shadow-none transition-colors border-0 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center pt-2">
          <p className="text-xs text-[#454745]">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-bold text-[#0e0f0c] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
