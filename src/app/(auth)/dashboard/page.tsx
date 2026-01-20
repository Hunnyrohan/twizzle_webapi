"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function DashboardPage() {
  const [tweetText, setTweetText] = useState("");
  const router = useRouter();

  const handleTweet = () => {
    console.log("Tweet:", tweetText);
    setTweetText("");
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // backend clears cookie
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* ==================== LEFT SIDEBAR ==================== */}
      <aside className="w-64 border-r border-gray-200 p-4 sticky top-0 h-screen">
        {/* Logo */}
        <div className="mb-8 pl-2">
          <svg
            width="40"
            height="40"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="logoGradient"
                x1="50"
                y1="30"
                x2="150"
                y2="170"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path
              d="M 100 30 Q 150 30 170 60 Q 190 90 170 120 Q 150 150 110 160 Q 70 170 50 140 Q 30 110 40 80 Q 50 50 80 40"
              stroke="url(#logoGradient)"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="115" cy="85" r="28" fill="#1e3a8a" />
            <circle cx="115" cy="85" r="20" fill="#3b82f6" />
          </svg>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-gray-100 font-semibold"
          >
            <span className="text-xl">Home</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-red-50 text-red-600 w-full text-left"
          >
            <span className="text-xl">Logout</span>
          </button>
        </nav>

        <button className="w-full bg-[#1da1f2] text-white font-bold py-3 rounded-full mt-4">
          Tweet
        </button>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 max-w-2xl border-r border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold">Home</h1>
        </div>

        <div className="border-b border-gray-200 p-4">
          <textarea
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            placeholder="What's happening?"
            className="w-full text-xl resize-none focus:outline-none"
          />

          <button
            onClick={handleTweet}
            disabled={!tweetText.trim()}
            className="bg-[#1da1f2] text-white font-bold py-2 px-6 rounded-full mt-4 disabled:opacity-50"
          >
            Tweet
          </button>
        </div>

        <div className="p-8 text-center text-gray-500">
          <p>Welcome to your dashboard 🎉</p>
        </div>
      </main>
    </div>
  );
}
