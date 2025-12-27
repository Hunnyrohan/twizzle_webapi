"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      console.log("Signup data:", data);
      // Add your signup API call here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Redirect to login or dashboard after successful signup
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0a2e] via-[#0f0f3a] to-[#16164a] items-center justify-center p-12">
        <div className="text-center">
          {/* Twizzle Logo SVG */}
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
              {/* Outer spiral shape */}
              <path
                d="M 100 30 Q 150 30 170 60 Q 190 90 170 120 Q 150 150 110 160 Q 70 170 50 140 Q 30 110 40 80 Q 50 50 80 40"
                stroke="url(#logoGradient)"
                strokeWidth="18"
                fill="none"
                strokeLinecap="round"
              />
              {/* Inner circle */}
              <circle cx="115" cy="85" r="28" fill="#1e3a8a" />
              <circle cx="115" cy="85" r="20" fill="#3b82f6" />
            </svg>
          </div>

          {/* Brand Name */}
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-cyan-400">Twizzle</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Join the conversation
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 flex justify-center">
            <svg
              width="70"
              height="70"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoGradientMobile"
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
                stroke="url(#logoGradientMobile)"
                strokeWidth="18"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="115" cy="85" r="28" fill="#1e3a8a" />
              <circle cx="115" cy="85" r="20" fill="#3b82f6" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Create your account
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Join Twizzle today
          </p>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <input
                {...register("fullName")}
                type="text"
                placeholder="Full name"
                className={`w-full px-4 py-3.5 border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.fullName && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email address"
                className={`w-full px-4 py-3.5 border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Username Input */}
            <div>
              <input
                {...register("username")}
                type="text"
                placeholder="Username"
                className={`w-full px-4 py-3.5 border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.username && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full px-4 py-3.5 border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm password"
                className={`w-full px-4 py-3.5 border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="text-xs text-gray-600 leading-relaxed">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-[#1da1f2] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#1da1f2] hover:underline">
                Privacy Policy
              </Link>
              .
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1da1f2] hover:bg-[#1a8cd8] text-white font-semibold py-3.5 px-4 rounded-full transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1da1f2]"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>

            {/* Footer Link */}
            <div className="text-center text-sm pt-2">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                href="/login"
                className="text-[#1da1f2] hover:underline font-medium"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}