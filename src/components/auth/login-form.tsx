"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
    identifier: z.string().min(1, "Phone number or email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

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
            
            console.log("Login success:", res.data);

            // Save token and user info
            // Save token and user info
            // API returns { success: true, data: { token, user } }
            const apiData = res.data.data || res.data; // Fallback just in case

            if (apiData.token) {
                localStorage.setItem('token', apiData.token);
            }
            if (apiData.user) {
                localStorage.setItem('user', JSON.stringify(apiData.user));
            }

            router.push("/dashboard");
        } catch (error: any) {
            console.error("Login error:", error);
            alert(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Sign in to Twizzle</h1>

            <button className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 text-black dark:text-white font-bold py-2.5 rounded-full mb-4 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <img
                    src="/google.svg"
                    alt="Google"
                    className="w-5 h-5 mr-3"
                />
                Sign in with Google
            </button>



            <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    {...register("identifier")}
                    placeholder="Phone, email, or username"
                    label="Phone, email, or username"
                    error={errors.identifier?.message}
                />

                <Input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    label="Password"
                    error={errors.password?.message}
                />

                <div className="pt-6">
                    <Button
                        type="submit"
                        variant="twitter_black"
                        size="full"
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        Next
                    </Button>
                </div>

                <div className="mt-6 space-y-4">
                    <Button
                        type="button"
                        variant="twitter_outline"
                        size="full"
                        onClick={() => { }}
                    >
                        Forgot password?
                    </Button>

                    <p className="text-gray-500 text-sm mt-3">
                        Don't have an account? <Link href="/signup" className="text-[#1d9bf0] hover:underline">Sign up</Link>
                    </p>
                </div>

            </form>
        </div>
    );
}
