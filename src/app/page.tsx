"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Zap, Shield, CheckCircle, MessageSquare, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-[#1d9bf0] selection:text-white flex flex-col">

      {/* Hero Section - Centered & Clean */}
      <section className="flex-grow flex items-center justify-center relative overflow-hidden py-32 md:py-48">

        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1d9bf0]/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
              <span className="text-sm font-semibold bg-gradient-to-r from-[#1d9bf0] to-purple-500 bg-clip-text text-transparent">
                The future of social is here
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
              Connect without <br />
              <span className="text-[#1d9bf0]">compromise.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              A simple, private, and open social network. <br className="hidden md:block" /> No algorithms, just you and your friends.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-10 rounded-full text-lg font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 hover:scale-105 transition-all w-full sm:w-auto">
                  Start for free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="h-14 px-10 rounded-full text-lg font-bold hover:bg-gray-100 dark:hover:bg-white/10 w-full sm:w-auto">
                  Log in
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-[#1d9bf0] mb-2">10M+</div>
              <div className="text-gray-500 font-medium">Messages Sent</div>
            </div>
            <div>
              <div className="text-4xl font-black text-purple-500 mb-2">500k+</div>
              <div className="text-gray-500 font-medium">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-500 mb-2">99.9%</div>
              <div className="text-gray-500 font-medium">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-black text-orange-500 mb-2">0</div>
              <div className="text-gray-500 font-medium">Ads</div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Why Twizzle?</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">We've stripped away the noise to bring you back to what matters: authentic connection.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">

            <div className="flex flex-col items-center text-center p-8 rounded-3xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 text-[#1d9bf0] rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-time</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
                Instant updates delivered globally via Edge networks. Experience conversations as they happen, with zero latency.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-3xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Privacy First</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
                Your data belongs to you. We don't sell your info, and all private messages are end-to-end encrypted by default.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-8 rounded-3xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Open Source</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
                Transparency at our core. Inspect the code, contribute features, and help shape the future of the platform.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-[#080808]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Loved by thousands</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white dark:bg-[#111] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 relative">
              <div className="absolute -top-4 left-8 text-6xl text-[#1d9bf0] opacity-20 font-serif">"</div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 relative z-10 leading-relaxed">
                Finally, a social network that feels like a community. No toxicity, just great conversations and interesting people.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="User" />
                </div>
                <div>
                  <div className="font-bold">Sarah Jenkins</div>
                  <div className="text-sm text-gray-500">Product Designer</div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-[#111] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 relative">
              <div className="absolute -top-4 left-8 text-6xl text-[#1d9bf0] opacity-20 font-serif">"</div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 relative z-10 leading-relaxed">
                The minimal interface is a breath of fresh air. I can actually focus on what people are saying, not just flashy ads.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" alt="User" />
                </div>
                <div>
                  <div className="font-bold">David Chen</div>
                  <div className="text-sm text-gray-500">Developer</div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-[#111] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 relative">
              <div className="absolute -top-4 left-8 text-6xl text-[#1d9bf0] opacity-20 font-serif">"</div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 relative z-10 leading-relaxed">
                I switched from X last month and haven't looked back. Twizzle reminds me of the early days of the internet.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" alt="User" />
                </div>
                <div>
                  <div className="font-bold">Elena Rodriguez</div>
                  <div className="text-sm text-gray-500">Journalist</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "Is Twizzle really free?", a: "Yes! Twizzle is completely free to use. We are supported by community donations and premium features for power users." },
              { q: "How is my data protected?", a: "We use industry-standard encryption for all data. Your private messages are end-to-end encrypted, meaning even we can't read them." },
              { q: "Can I verify my account?", a: "Yes, verified badges are available. However, unlike other platforms, we verify identity, not just ability to pay." },
              { q: "Is there an API available?", a: "Absolutely. We are API-first. You can build bots, clients, and integrations easily using our documented API." }

            ].map((item, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-[#111] transition-colors cursor-pointer group">
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#1d9bf0] transition-colors flex items-center justify-between">
                  {item.q}
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity transform -rotate-45 group-hover:rotate-0" />
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#1d9bf0] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8">Join the conversation.</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Stop scrolling, start connecting. Create your account in seconds and see what's happening.
          </p>
          <Link href="/signup">
            <Button size="lg" className="h-16 px-12 rounded-full text-xl font-bold bg-white text-[#1d9bf0] hover:bg-gray-100 hover:scale-105 transition-transform">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
