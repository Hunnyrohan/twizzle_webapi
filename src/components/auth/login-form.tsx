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
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
    identifier: z.string().min(1, "Phone number, email, or username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

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

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const { login: authLogin } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData): Promise<void> => {
        setIsLoading(true);
        try {
            const res = await api.post("/auth/login", data);
            const apiData = res.data.data || res.data;

            if (apiData.needsReactivation) {
                if (window.confirm(apiData.message || "Your account is deactivated. Reactivate and log in?")) {
                    const reactivateRes = await api.post("/auth/login", { ...data, confirmReactivate: true });
                    const reactivateData = reactivateRes.data.data || reactivateRes.data;

                    if (reactivateData.token && reactivateData.user) {
                        authLogin(reactivateData.token, reactivateData.user);
                        router.push("/dashboard");
                        return;
                    }
                }
                setIsLoading(false);
                return;
            }

            if (apiData.token && apiData.user) {
                authLogin(apiData.token, apiData.user);
            }

            router.push("/dashboard");
        } catch (error: any) {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.message ||
                error.message ||
                "Login failed";
            alert(errorMessage);
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

            if (apiData.needsReactivation) {
                if (window.confirm(apiData.message || "Your account is deactivated. Reactivate and log in?")) {
                    const reactivateRes = await api.post("/auth/google-login", {
                        idToken: credentialResponse.credential,
                        confirmReactivate: true
                    });
                    const reactivateData = reactivateRes.data.data || reactivateRes.data;

                    if (reactivateData.token && reactivateData.user) {
                        authLogin(reactivateData.token, reactivateData.user);
                        router.push("/dashboard");
                        return;
                    }
                }
                setIsLoading(false);
                return;
            }

            if (apiData.token && apiData.user) {
                authLogin(apiData.token, apiData.user);
            }

            router.push("/dashboard");
        } catch (error: any) {
            console.error("Google login error:", error);
            alert(error.response?.data?.error?.message || error.response?.data?.message || "Google login failed");
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
                    Welcome back
                </h1>
                <p className="text-white/50 font-medium">Log in to your Twizzle account</p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center mb-8">
                <div className="w-full overflow-hidden rounded-xl">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log('Login Failed')}
                        theme="filled_black"
                        shape="pill"
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
                        {...register("identifier")}
                        label="Phone, email, or username"
                        error={errors.identifier?.message}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Input
                        {...register("password")}
                        type="password"
                        label="Password"
                        error={errors.password?.message}
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
                        Sign In
                    </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-10 flex flex-col items-center space-y-6">
                    <Link href="/forgot-password">
                        <span className="text-[#1d9bf0] text-sm font-bold hover:underline cursor-pointer transition-colors">
                            Forgot password?
                        </span>
                    </Link>
                    <div className="h-px w-full bg-white/5" />
                    <p className="text-white/40 text-sm font-medium">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-[#1d9bf0] font-black hover:underline transition-colors ml-1">
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </form>
        </motion.div>
    );
}
