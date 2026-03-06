import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Image as ImageIcon, X } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface MessageComposerProps {
    onSend: (text: string, files: File[]) => void;
    disabled?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ onSend, disabled }) => {
    const [text, setText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((text.trim() || selectedFiles.length > 0) && !disabled) {
            onSend(text, selectedFiles);
            setText('');
            setSelectedFiles([]);
            setShowEmojiPicker(false);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...files].slice(0, 5)); // Limit to 5
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setText((prev) => prev + emojiData.emoji);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [text]);

    return (
        <div className="p-4 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 relative">
            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50">
                    <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        theme={'auto' as any}
                        lazyLoadEmojis={true}
                    />
                </div>
            )}

            {/* Image Previews */}
            {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 px-2">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70 transition-all"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-end bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl px-3 py-1.5 shadow-xs focus-within:shadow-sm focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-all">
                <div className="flex pb-1">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all active:scale-90"
                    >
                        <ImageIcon size={20} />
                    </button>
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all active:scale-90 ${showEmojiPicker ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
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
                    disabled={(!text.trim() && selectedFiles.length === 0) || disabled}
                    className={`p-2.5 rounded-full transition-all mb-1 transform active:scale-95 ${(text.trim() || selectedFiles.length > 0) && !disabled
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
