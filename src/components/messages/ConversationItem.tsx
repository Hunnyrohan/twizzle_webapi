import React from 'react';
import { Conversation } from '@/types/messages';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import VerifiedBadge from '../common/VerifiedBadge';
import { resolveImageUrl } from '@/lib/media-utils';

interface ConversationItemProps {
    conversation: Conversation;
    isActive: boolean;
    onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isActive, onClick }) => {
    const { otherUser, lastMessage, unreadCount, updatedAt } = conversation;
    const router = useRouter();

    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/profile/${otherUser.username}`);
    };

    return (
        <div
            onClick={onClick}
            className={`flex items-center px-4 py-3.5 cursor-pointer transition-all border-b border-gray-100 dark:border-gray-800 relative group overflow-hidden ${isActive
                ? 'bg-blue-50 dark:bg-blue-900/10'
                : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
                }`}
        >
            {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-r-full shadow-lg shadow-blue-500/50" />
            )}

            <div className="relative flex-shrink-0" onClick={handleProfileClick}>
                <img
                    src={resolveImageUrl(otherUser.image) || `https://ui-avatars.com/api/?name=${otherUser.name}`}
                    alt={otherUser.name}
                    className={`w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-black transition-transform duration-300 group-hover:scale-105 ${isActive ? 'ring-blue-100 dark:ring-blue-900/30' : 'bg-gray-200 dark:bg-gray-800'
                        }`}
                />
                {/* Status indicator mockup */}
                <div className="absolute bottom-0 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-black rounded-full shadow-xs"></div>
            </div>

            <div className="ml-3.5 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <h4
                        onClick={handleProfileClick}
                        className={`font-bold truncate text-[15px] flex items-center gap-1 hover:text-blue-500 transition-colors ${unreadCount > 0 ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                        {otherUser.name}
                        {otherUser.isVerified && <VerifiedBadge size={14} />}
                    </h4>
                    <span className={`text-[11px] font-medium whitespace-nowrap ml-2 ${unreadCount > 0 ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}>
                        {lastMessage?.createdAt ? formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: false }).replace('about ', '') : ''}
                    </span>
                </div>

                <div className="flex justify-between items-center mt-1">
                    <p className={`text-sm truncate leading-tight ${unreadCount > 0 ? 'text-gray-900 dark:text-gray-100 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                        {lastMessage?.status === 'sent' && lastMessage.senderId !== otherUser.id && (
                            <span className="text-gray-400 dark:text-gray-600 font-normal">You: </span>
                        )}
                        {lastMessage?.type === 'call'
                            ? `${lastMessage.callData?.type === 'video' ? 'Video' : 'Voice'} call ${lastMessage.callData?.status === 'missed' ? 'missed' : 'ended'}`
                            : (lastMessage?.text || 'Started a conversation')
                        }
                    </p>

                    {unreadCount > 0 && (
                        <div className="ml-2 bg-blue-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[18px] h-5 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            {unreadCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
