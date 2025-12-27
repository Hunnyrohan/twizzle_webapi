"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [tweetText, setTweetText] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const handleTweet = () => {
    console.log("Tweet:", tweetText);
    setTweetText("");
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1da1f2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

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
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-gray-100 transition-colors text-black font-semibold"
          >
            <svg className="w-7 h-7 text-[#1da1f2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v8.22c0 4.45-3.05 8.7-8 9.88-4.95-1.18-8-5.43-8-9.88V7.78l8-3.6z" />
            </svg>
            <span className="text-xl">Home</span>
          </Link>

          <Link
            href="/explore"
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">#</span>
            <span className="text-xl">Explore</span>
          </Link>

          <Link
            href="/notifications"
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-xl">Notifications</span>
          </Link>

          <Link
            href="/messages"
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xl">Messages</span>
          </Link>

          <Link
            href="/bookmarks"
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-xl">Bookmarks</span>
          </Link>

          <Link
            href="/lists"
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-xl">Lists</span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xl">Profile</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-full hover:bg-red-50 transition-colors text-red-600 w-full text-left"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-xl">Logout</span>
          </button>
        </nav>

        {/* Tweet Button */}
        <button className="w-full bg-[#1da1f2] hover:bg-[#1a8cd8] text-white font-bold py-3 px-4 rounded-full mt-4 transition-colors">
          Tweet
        </button>

        {/* User Profile at Bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                JB
              </div>
              <div>
                <p className="font-bold text-sm">Jerome Bell</p>
                <p className="text-gray-500 text-sm">@donsiomocente</p>
              </div>
            </div>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 max-w-2xl border-r border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <h1 className="text-xl font-bold">Home</h1>
        </div>

        {/* Tweet Composer */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <textarea
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                placeholder="What's happening?"
                className="w-full text-xl resize-none border-none focus:outline-none placeholder-gray-500 min-h-[80px]"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <button className="text-[#1da1f2] hover:bg-blue-50 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                    </svg>
                  </button>
                  <button className="text-[#1da1f2] hover:bg-blue-50 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12H9.5v-2H11v2zm0-3H9.5V9H11v3zm3 3h-1.5v-2H14v2zm0-3h-1.5V9H14v3z" />
                    </svg>
                  </button>
                  <button className="text-[#1da1f2] hover:bg-blue-50 p-2 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <circle cx="9" cy="10" r="1.5" />
                      <circle cx="15" cy="10" r="1.5" />
                      <path d="M9 15s1 2 3 2 3-2 3-2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handleTweet}
                  className="bg-[#1da1f2] hover:bg-[#1a8cd8] text-white font-bold py-2 px-6 rounded-full transition-colors disabled:opacity-50"
                  disabled={!tweetText.trim()}
                >
                  Tweet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tweet Feed - Add more tweets here from Part 2 */}
        <div className="p-8 text-center text-gray-500">
          <p>Welcome to your dashboard! 🎉</p>
          <p className="mt-2">Start tweeting to see your feed here.</p>
        </div>
      </main>

      {/* ==================== RIGHT SIDEBAR ==================== */}
      <aside className="w-80 p-4 hidden xl:block">
        {/* Search */}
        <div className="sticky top-0 bg-white pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Twizzle"
              className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1da1f2] focus:bg-white transition-all"
            />
            <svg
              className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* What's happening */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <h2 className="text-xl font-bold mb-4">What's happening</h2>
          
          <div className="space-y-4">
            <div className="hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer">
              <div className="text-xs text-gray-500">Trending · Today</div>
              <div className="font-bold text-sm mt-1">
                Welcome to Twizzle!
              </div>
              <div className="text-xs text-gray-500 mt-1">Getting started</div>
            </div>
          </div>

          <button className="text-[#1da1f2] hover:underline text-sm mt-4">
            Show more
          </button>
        </div>

        {/* Who to follow */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">Who to follow</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full"></div>
                <div>
                  <p className="font-bold text-sm">Bessie Cooper</p>
                  <p className="text-gray-500 text-sm">@alessandroveron...</p>
                </div>
              </div>
              <button className="bg-black hover:bg-gray-800 text-white font-bold py-1.5 px-4 rounded-full text-sm transition-colors">
                Follow
              </button>
            </div>
          </div>

          <button className="text-[#1da1f2] hover:underline text-sm mt-4">
            Show more
          </button>
        </div>
      </aside>
    </div>
  );
}