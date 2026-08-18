'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"
import { signInSchema } from '@/schemas/signInSchema';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
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
            Welcome Back
          </h1>
          <p className="text-sm text-[#454745]">Sign in to continue managing your secret feedback board</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-[#0e0f0c]">Email or Username</FormLabel>
                  <Input {...field} className="h-11 rounded-xl border-[#d5dad2] focus:border-[#9fe870] text-base" />
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
                  <Input type="password" {...field} className="h-11 rounded-xl border-[#d5dad2] focus:border-[#9fe870] text-base" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full h-11 bg-[#9fe870] text-[#0e0f0c] hover:bg-[#cdffad] font-semibold text-base rounded-full shadow-none transition-colors border-0 mt-2" type="submit">
              Sign In
            </Button>
          </form>
        </Form>

        <div className="rounded-[16px] bg-[#e2f6d5] border border-[#c5edab] p-4 text-xs text-[#054d28] space-y-1">
          <p className="font-bold text-[#054d28] text-sm">Test Credentials</p>
          <p>Username: <span className="font-mono font-bold">Testing</span></p>
          <p>Password: <span className="font-mono font-bold">12345678</span></p>
          <p className="pt-2 text-[#054d28]">
            Need an account?{' '}
            <Link href="/sign-up" className="font-bold underline hover:text-[#0e0f0c]">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}