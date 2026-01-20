"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/axios";

const loginSchema = z.object({
  identifier: z.string().min(1, "Phone number or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
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

      // Cookie is stored automatically (httpOnly)
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0a2e] via-[#0f0f3a] to-[#16164a] items-center justify-center p-12">
        <div className="text-center">
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

          <h1 className="text-6xl font-bold">
            <span className="text-cyan-400">Twizzle</span>
          </h1>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
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

          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Log in to Twizzle
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <input
                {...register("identifier")}
                type="text"
                placeholder="Phone number, email address"
                className={`w-full px-4 py-3.5 border rounded-lg ${
                  errors.identifier
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.identifier && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-3.5 border rounded-lg ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1da1f2] text-white font-semibold py-3.5 rounded-full disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            <div className="flex justify-between items-center text-sm pt-2">
              <Link href="/forgot-password" className="text-[#1da1f2]">
                Forgot password?
              </Link>
              <Link href="/signup" className="text-[#1da1f2]">
                Sign up to Twizzle
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
