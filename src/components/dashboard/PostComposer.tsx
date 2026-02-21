"use client";

import { useState } from "react";
import { Image as ImageIcon, Smile, Calendar, MapPin, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function PostComposer() {
    const { user } = useAuth();
    const [content, setContent] = useState("");

    const handleSubmit = async () => {
        // TODO: Implement post creation logic
        console.log("Posting:", content);
        setContent("");
    };

    return (
        <div className="border-b border-gray-200 dark:border-gray-800 p-4">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img
                        src={user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`}
                        alt={user?.name || 'User'}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What is happening?!"
                        className="w-full bg-transparent text-xl placeholder-gray-500 border-none outline-none resize-none min-h-[50px] py-2"
                        rows={2}
                    />

                    {content && (
                        <div className="border-b border-gray-200 dark:border-gray-800 my-2"></div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-[#1d9bf0]">
                            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group">
                                <ImageIcon className="w-5 h-5" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Media</span>
                            </button>
                            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group">
                                <span className="border border-current rounded-sm text-[10px] w-5 h-5 flex items-center justify-center font-bold">GIF</span>
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">GIF</span>
                            </button>
                            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group">
                                <BarChart2 className="w-5 h-5" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Poll</span>
                            </button>
                            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group">
                                <Smile className="w-5 h-5" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Emoji</span>
                            </button>
                            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group">
                                <Calendar className="w-5 h-5" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Schedule</span>
                            </button>
                            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors relative group disabled:opacity-50" disabled>
                                <MapPin className="w-5 h-5" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Location</span>
                            </button>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full font-bold px-6 py-1.5 h-auto opacity-100 disabled:opacity-50"
                            disabled={!content.trim()}
                        >
                            Post
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
