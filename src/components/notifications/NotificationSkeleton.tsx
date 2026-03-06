// frontend/src/components/notifications/NotificationSkeleton.tsx
interface NotificationSkeletonProps {
    showPreview?: boolean;
}

export const NotificationSkeleton: React.FC<NotificationSkeletonProps> = ({
    showPreview = false
}) => {
    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 animate-pulse">
            <div className="flex gap-3">
                {/* Avatar skeleton */}
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />

                <div className="flex-1 space-y-2">
                    {/* Text skeleton */}
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />

                    {/* Post preview skeleton */}
                    {showPreview && (
                        <div className="mt-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
