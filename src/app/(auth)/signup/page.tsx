"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

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

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        password: data.password,
      });

      alert("Account created successfully");
      router.push("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0a2e] via-[#0f0f3a] to-[#16164a] items-center justify-center p-12">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="50"
                  y1="30"
                  x2="150"
                  y2="170"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <path
                d="M 100 30 Q 150 30 170 60 Q 190 90 170 120 Q 150 150 110 160 Q 70 170 50 140 Q 30 110 40 80 Q 50 50 80 40"
                stroke="url(#logoGradient)"
                strokeWidth="18"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="115" cy="85" r="28" fill="#1e3a8a" />
              <circle cx="115" cy="85" r="20" fill="#3b82f6" />
            </svg>
          </div>

          <h1 className="text-6xl font-bold mb-4">
            <span className="text-cyan-400">Twizzle</span>
          </h1>
          <p className="text-gray-300 text-lg">Join the conversation</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Create your account
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Join Twizzle today
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("fullName")}
              placeholder="Full name"
              className="w-full px-4 py-3.5 border rounded-lg"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}

            <input
              {...register("email")}
              placeholder="Email address"
              className="w-full px-4 py-3.5 border rounded-lg"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}

            <input
              {...register("username")}
              placeholder="Username"
              className="w-full px-4 py-3.5 border rounded-lg"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}

            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-3.5 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                👁
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}

            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-3.5 border rounded-lg"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1da1f2] text-white font-semibold py-3.5 rounded-full disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>

            <div className="text-center text-sm pt-2">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-[#1da1f2] font-medium">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
