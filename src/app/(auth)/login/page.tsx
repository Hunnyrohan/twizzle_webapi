"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const loginSchema = z.object({
  identifier: z.string().min(1, "Phone number or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log("Login data:", data);
      
      // TODO: Replace this with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        identifier: data.identifier,
        isAuthenticated: true
      }));
      
      // Navigate to dashboard after successful login
      router.push('/dashboard');
      
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0a2e] via-[#0f0f3a] to-[#16164a] items-center justify-center p-12">
        <div className="text-center">
          {/* Twizzle Logo Image */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/twizzle-logo.png"
              alt="Twizzle Logo"
             
              width={200}
              height={200}
              className="object-contain"
              priority
            />
          </div>

          {/* Brand Name */}
          <h1 className="text-6xl font-bold">
            <span className="text-cyan-400">Twizzle</span>
          </h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Image
              src="/twizzle-logo.png"
              alt="Twizzle Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Log in to Twizzle
          </h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Phone/Email Input */}
            <div>
              <input
                {...register("identifier")}
                type="text"
                placeholder="Phone number, email address"
                className={`w-full px-4 py-3.5 border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.identifier
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.identifier && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-3.5 border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Log In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1da1f2] hover:bg-[#1a8cd8] text-white font-semibold py-3.5 px-4 rounded-full transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1da1f2]"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            {/* Footer Links */}
            <div className="flex justify-between items-center text-sm pt-2">
              <Link
                href="/forgot-password"
                className="text-[#1da1f2] hover:underline font-medium"
              >
                Forgot password?
              </Link>
              <Link
                href="/signup"
                className="text-[#1da1f2] hover:underline font-medium"
              >
                Sign up to Twizzle
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}