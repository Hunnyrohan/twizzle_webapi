import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Image as ImageIcon } from 'lucide-react';

interface MessageComposerProps {
    onSend: (text: string) => void;
    disabled?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ onSend, disabled }) => {
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (text.trim() && !disabled) {
            onSend(text);
            setText('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [text]);

    return (
        <div className="p-4 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-end bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl px-3 py-1.5 shadow-xs focus-within:shadow-sm focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-all">
                <div className="flex pb-1">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all active:scale-90">
                        <ImageIcon size={20} />
                    </button>
                    <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all active:scale-90">
                        <Smile size={20} />
                    </button>
                </div>

                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Start a new message"
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-3 px-2 text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 scrollbar-hide"
                    rows={1}
                />

                <button
                    onClick={() => handleSubmit()}
                    disabled={!text.trim() || disabled}
                    className={`p-2.5 rounded-full transition-all mb-1 transform active:scale-95 ${text.trim() && !disabled
                        ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:shadow-lg'
                        : 'text-gray-400 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                        }`}
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};
