"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

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

export default function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordData): Promise<void> => {
        setIsLoading(true);
        try {
            await api.post("/auth/forgot-password", data);
            sessionStorage.setItem("resetEmail", data.email);
            router.push("/reset-password");
        } catch (error: any) {
            console.error("Forgot password error:", error);
            alert(error.response?.data?.error || "Failed to send reset code");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[400px] mx-auto"
        >
            <motion.div variants={itemVariants} className="text-center mb-10">
                <h1 className="text-4xl font-black mb-3 text-white tracking-tight leading-tight">
                    Find account
                </h1>
                <p className="text-white/50 font-medium">Reset your Twizzle password</p>
            </motion.div>

            <motion.p
                variants={itemVariants}
                className="text-white/40 mb-10 text-center font-medium leading-relaxed"
            >
                Enter your registered email to receive a password reset code.
            </motion.p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <motion.div variants={itemVariants}>
                    <Input
                        {...register("email")}
                        label="Email Address"
                        error={errors.email?.message}
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
                        Send Code
                    </Button>
                </motion.div>
            </form>
        </motion.div>
    );
}
