'use client';

import React, { useState } from 'react';
import { paymentService } from '@/lib/api';
import { motion } from 'framer-motion';
import { BadgeCheck, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

interface VerificationSettingsFormProps {
    user: any;
}

export const VerificationSettingsForm: React.FC<VerificationSettingsFormProps> = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInitiate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await paymentService.initiateVerification();
            if (res.success) {
                const { gatewayUrl, params } = res.data;

                // Create a form dynamically and submit it
                const formElement = document.createElement('form');
                formElement.method = 'POST';
                formElement.action = gatewayUrl;

                Object.entries(params).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = String(value);
                    formElement.appendChild(input);
                });

                document.body.appendChild(formElement);
                formElement.submit();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to initiate verification');
        } finally {
            setLoading(false);
        }
    };

    if (user?.isVerified) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        Twizzle Verified <BadgeCheck className="w-6 h-6 text-[#1d9bf0]" />
                    </h2>
                    <p className="text-gray-500 mt-2">Your account is already verified.</p>
                </div>

                <div className="bg-[#1d9bf0]/10 border border-[#1d9bf0]/20 rounded-3xl p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#1d9bf0] flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Subscription</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                You have access to all premium features, including the blue checkmark and priority in conversations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Twizzle Verified</h2>
                <p className="text-gray-500 mt-2">Elevate your presence on Twizzle with a blue checkmark.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-3xl">
                    <Zap className="w-8 h-8 text-yellow-500 mb-4" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Priority Ranking</h3>
                    <p className="text-sm text-gray-500 mt-2">Your replies and posts get a boost to reach more people.</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-3xl">
                    <BadgeCheck className="w-8 h-8 text-[#1d9bf0] mb-4" />
                    <h3 className="font-bold text-gray-900 dark:text-white">Blue Checkmark</h3>
                    <p className="text-sm text-gray-500 mt-2">Show the world that your account is authentic and verified.</p>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-3xl p-8 border border-gray-200 dark:border-zinc-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-sm font-bold text-[#1d9bf0] uppercase tracking-wider">Verification Fee</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-4xl font-black text-gray-900 dark:text-white">NPR 199</span>
                            <span className="text-gray-500 font-medium">/ one-time</span>
                        </div>
                    </div>

                    <button
                        onClick={handleInitiate}
                        disabled={loading}
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-10 py-4 rounded-2xl font-black transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Get Verified'}
                    </button>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-500 text-center px-4">
                By clicking "Get Verified", you agree to our Terms of Service. Payment is handled securely via eSewa.
            </p>
        </div>
    );
};
