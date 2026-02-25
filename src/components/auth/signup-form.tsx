"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const signupSchema = z
    .object({
        fullName: z.string().min(2, "Full name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        username: z
            .string()
            .min(3, "Username must be at least 3 characters")
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers, and underscores"
            ),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type SignupFormData = z.infer<typeof signupSchema>;

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

export default function SignupForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData): Promise<void> => {
        setIsLoading(true);
        try {
            await api.post("/auth/register", {
                name: data.fullName,
                email: data.email,
                username: data.username,
                password: data.password,
            });

            router.push("/login?registered=true");
        } catch (error: any) {
            console.error("Signup error:", error);
            alert(error.response?.data?.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        try {
            const res = await api.post("/auth/google-login", {
                idToken: credentialResponse.credential
            });

            const apiData = res.data.data || res.data;
            if (apiData.token) localStorage.setItem('token', apiData.token);
            if (apiData.user) localStorage.setItem('user', JSON.stringify(apiData.user));

            router.push("/dashboard");
        } catch (error: any) {
            console.error("Google login error:", error);
            alert(error.response?.data?.error || "Google login failed");
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
                    Create account
                </h1>
                <p className="text-white/50 font-medium">Join the Twizzle community today</p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center mb-8">
                <div className="w-full overflow-hidden rounded-xl bg-white p-[1px] shadow-sm hover:shadow-md transition-shadow">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log('Login Failed')}
                        useOneTap
                        theme="outline"
                        shape="rectangular"
                        width={380}
                    />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center my-8">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/30 text-[10px] font-black tracking-[0.2em] uppercase">or</span>
                <div className="flex-grow border-t border-white/10"></div>
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <motion.div variants={itemVariants}>
                    <Input
                        {...register("fullName")}
                        label="Full Name"
                        error={errors.fullName?.message}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Input
                        {...register("email")}
                        label="Email Address"
                        error={errors.email?.message}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Input
                        {...register("username")}
                        label="Username"
                        error={errors.username?.message}
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div variants={itemVariants}>
                        <Input
                            {...register("password")}
                            type="password"
                            label="Password"
                            error={errors.password?.message}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Input
                            {...register("confirmPassword")}
                            type="password"
                            label="Confirm"
                            error={errors.confirmPassword?.message}
                        />
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="pt-6">
                    <Button
                        type="submit"
                        variant="twitter"
                        size="full"
                        isLoading={isLoading}
                        disabled={isLoading}
                        className="h-14 w-full text-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] transition-all active:scale-[0.98] rounded-xl font-bold shadow-lg shadow-[#1d9bf0]/20"
                    >
                        Create Account
                    </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-10 flex flex-col items-center space-y-6">
                    <div className="h-px w-full bg-white/5" />
                    <p className="text-white/40 text-sm font-medium">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#1d9bf0] font-black hover:underline transition-colors ml-1">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </form>
        </motion.div>
    );
}
