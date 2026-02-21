'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.username) {
                    router.push(`/profile/${user.username}`);
                    return;
                }
            } catch (e) { }
        }
        // Fallback if no user or parsing fails
        router.push('/login');
    }, [router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );
}
