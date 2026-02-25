'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentService } from '@/lib/api';
import { BadgeCheck, Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        const confirmPayment = async () => {
            const data = searchParams.get('data');

            if (!data) {
                setStatus('error');
                setMessage('Missing required payment parameters.');
                return;
            }

            try {
                const res = await paymentService.confirmVerification(data);

                if (res.success) {
                    setStatus('success');
                    setMessage('Your account has been successfully verified! Redirecting to settings...');

                    // Update local user data if possible
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const user = JSON.parse(storedUser);
                        user.isVerified = true;
                        localStorage.setItem('user', JSON.stringify(user));
                    }

                    setTimeout(() => {
                        router.push('/settings?tab=verification');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(res.message || 'Payment verification failed.');
                }
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'An error occurred during verification.');
            }
        };

        confirmPayment();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[32px] p-12 text-center shadow-2xl shadow-black/5"
            >
                <div className="flex justify-center mb-8">
                    {status === 'verifying' && (
                        <Loader2 className="w-16 h-16 text-[#1d9bf0] animate-spin" />
                    )}
                    {status === 'success' && (
                        <div className="relative">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full border-4 border-white dark:border-zinc-900"
                            >
                                <BadgeCheck className="w-4 h-4" />
                            </motion.div>
                        </div>
                    )}
                    {status === 'error' && (
                        <XCircle className="w-16 h-16 text-red-500" />
                    )}
                </div>

                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                    {status === 'verifying' && 'Processing Payment'}
                    {status === 'success' && 'You are Verified!'}
                    {status === 'error' && 'Something went wrong'}
                </h1>

                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {message}
                </p>

                {status === 'error' && (
                    <button
                        onClick={() => router.push('/settings')}
                        className="mt-8 w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold hover:opacity-90 transition-all"
                    >
                        Back to Settings
                    </button>
                )}
            </motion.div>
        </div>
    );
}
