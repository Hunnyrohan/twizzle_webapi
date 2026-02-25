'use client';

import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { ComposeBox } from './ComposeBox';
import { Post } from '@/types';

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: (post: Post) => void;
}

export const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onPostCreated }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handlePostCreated = (post: Post) => {
        if (onPostCreated) {
            onPostCreated(post);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/98 backdrop-blur-xl p-0 sm:p-4 transition-all duration-300">
            <div
                ref={modalRef}
                className="bg-white dark:bg-[#15181c] w-full max-w-[620px] h-full sm:h-auto sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col border-none sm:border sm:border-gray-800/50 animate-in fade-in zoom-in duration-300 relative shadow-blue-500/10"
            >
                <div className="px-6 py-4 flex items-center !bg-white dark:!bg-[#15181c] sticky top-0 z-[110]">
                    <button
                        onClick={onClose}
                        className="p-2 -ml-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                    <div className="flex-1 text-center pr-8">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Compose Post</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto !bg-white dark:!bg-[#15181c] px-2 pb-6">
                    <ComposeBox onPostCreated={handlePostCreated} isModal={true} />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .dark .bg-white { background-color: #15181c !important; }
                .bg-white { background-color: #ffffff !important; }
            `}} />
        </div>
    );
};
