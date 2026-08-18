/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-8 py-12 md:py-20 bg-[#e8ebe6] text-[#0e0f0c]">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 mb-12">
        <div className="inline-flex items-center space-x-2 bg-[#e2f6d5] text-[#054d28] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
          <Sparkles className="w-4 h-4 text-[#2ead4b]" />
          <span>AI-Powered Anonymous Feedback</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] text-[#0e0f0c]">
          Dive into honest, anonymous feedback.
        </h1>

        <p className="text-lg sm:text-xl text-[#454745] max-w-2xl mx-auto font-normal">
          Create your personal board, share your link, and receive authentic messages from friends, fans, and colleagues.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link href="/sign-up">
            <Button className="w-full sm:w-auto bg-[#9fe870] text-[#0e0f0c] hover:bg-[#cdffad] font-semibold text-base sm:text-lg px-8 py-6 rounded-full shadow-none transition-all flex items-center justify-center gap-2">
              Get Your Free Link <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button className="w-full sm:w-auto bg-white text-[#0e0f0c] hover:bg-[#f4f6f3] border border-[#d5dad2] font-semibold text-base sm:text-lg px-8 py-6 rounded-full shadow-none transition-all">
              Sign In to Board
            </Button>
          </Link>
        </div>
      </section>

      {/* Interactive Carousel for Messages */}
      <section className="w-full max-w-2xl mx-auto mb-16">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#0e0f0c] tracking-tight">Recent Anonymous Notes</h2>
        </div>

        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-2">
                <Card className="bg-white border-0 shadow-sm rounded-[24px] p-6 text-[#0e0f0c]">
                  <CardHeader className="p-0 mb-3">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-[#0e0f0c]">
                      <MessageSquare className="w-5 h-5 text-[#2ead4b]" />
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-col space-y-3">
                    <p className="text-base text-[#454745] leading-relaxed">{message.content}</p>
                    <span className="text-xs font-semibold text-[#868685]">
                      Received {message.received}
                    </span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#e2f6d5] p-8 rounded-[24px] flex flex-col space-y-3">
          <ShieldCheck className="w-8 h-8 text-[#054d28]" />
          <h3 className="text-xl font-bold text-[#0e0f0c]">100% Anonymous</h3>
          <p className="text-sm text-[#454745]">
            No logins required for senders. Honest messages without friction.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[24px] flex flex-col space-y-3 shadow-sm border border-[#d5dad2]">
          <Sparkles className="w-8 h-8 text-[#2ead4b]" />
          <h3 className="text-xl font-bold text-[#0e0f0c]">AI Prompt Assist</h3>
          <p className="text-sm text-[#454745]">
            Powered by Google Gemini to help senders draft engaging, creative questions.
          </p>
        </div>

        <div className="bg-[#0e0f0c] text-[#9fe870] p-8 rounded-[24px] flex flex-col space-y-3">
          <Mail className="w-8 h-8 text-[#9fe870]" />
          <h3 className="text-xl font-bold text-white">Full Control</h3>
          <p className="text-sm text-[#e8ebe6]">
            Toggle message acceptance anytime or delete messages with one click.
          </p>
        </div>
      </section>
    </main>
  );
}