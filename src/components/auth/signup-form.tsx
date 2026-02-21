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

            // alert("Account created successfully");
            router.push("/login?registered=true");
        } catch (error: any) {
            console.error("Signup error:", error);
            alert(error.response?.data?.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Create your account</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    {...register("fullName")}
                    placeholder="Name"
                    label="Name"
                    error={errors.fullName?.message}
                />

                <Input
                    {...register("email")}
                    placeholder="Email"
                    label="Email"
                    error={errors.email?.message}
                />

                <Input
                    {...register("username")}
                    placeholder="Username"
                    label="Username"
                    error={errors.username?.message}
                />

                <Input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    label="Password"
                    error={errors.password?.message}
                />

                <Input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="Confirm Password"
                    label="Confirm Password"
                    error={errors.confirmPassword?.message}
                />

                <div className="pt-10">
                    <Button
                        type="submit"
                        variant="twitter"
                        size="full"
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        Sign up
                    </Button>
                </div>
            </form>
        </div>
    );
}
