"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const resetPasswordSchema = z.object({
    resetCode: z.string().trim().regex(/^\d{6}$/, "Reset code must be 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

export default function ResetPasswordForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("resetEmail");
        if (!storedEmail) {
            router.push("/forgot-password");
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ResetPasswordData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordData): Promise<void> => {
        setIsLoading(true);
        try {
            await api.post("/auth/reset-password", {
                resetCode: data.resetCode,
                newPassword: data.newPassword,
            });

            alert("Password reset successful! You can now log in.");
            sessionStorage.removeItem("resetEmail");
            router.push("/login");
        } catch (error: any) {
            console.error("Reset password error:", error);
            alert(error.response?.data?.error || "Invalid or expired reset code");
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) return null;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[400px] mx-auto"
        >
            <motion.div variants={itemVariants} className="text-center mb-10">
                <h1 className="text-4xl font-black mb-3 text-white tracking-tight leading-tight">
                    Reset security
                </h1>
                <p className="text-white/60 text-lg font-medium leading-relaxed">
                    Verification code sent to <br />
                    <span className="text-[#1d9bf0] font-black">{email}</span>.
                </p>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <motion.div variants={itemVariants}>
                    <Input
                        {...register("resetCode")}
                        label="6-Digit Code"
                        error={errors.resetCode?.message}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Input
                        {...register("newPassword")}
                        type="password"
                        label="New Password"
                        error={errors.newPassword?.message}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Input
                        {...register("confirmPassword")}
                        type="password"
                        label="Confirm Password"
                        error={errors.confirmPassword?.message}
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="pt-6">
                    <Button
                        type="submit"
                        variant="twitter"
                        size="full"
                        isLoading={isLoading}
                        disabled={isLoading}
                        className="h-14 w-full text-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] transition-all active:scale-[0.98] rounded-xl font-bold shadow-lg shadow-[#1d9bf0]/20"
                    >
                        Verify & Reset
                    </Button>
                </motion.div>
            </form>
        </motion.div>
    );
}
