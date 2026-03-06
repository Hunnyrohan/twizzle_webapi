'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentFailurePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[32px] p-12 text-center shadow-2xl shadow-black/5"
            >
                <div className="flex justify-center mb-8">
                    <XCircle className="w-16 h-16 text-red-500" />
                </div>

                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                    Payment Failed
                </h1>

                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    We couldn't process your payment. This might be due to a cancellation or a technical issue. Don't worry, no charges were made.
                </p>

                <div className="mt-8 space-y-3">
                    <button
                        onClick={() => router.push('/settings?tab=verification')}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold hover:opacity-90 transition-all"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white py-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
                    >
                        Return Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
