"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AuthLayout from "./auth/auth-layout";

export default function AuthPage() {
  return (
    <AuthLayout closeUrl="/">
      <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8">
        {/* Mobile Logo */}
        <div className="md:hidden">
          <Image
            src="/twizzle-logo-new.png"
            alt="Twizzle Logo"
            width={60}
            height={60}
            className="rounded-full shadow-lg"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight italic">
            Happening now
          </h1>
          <h3 className="text-2xl md:text-3xl font-bold text-white/70 tracking-tight">
            Join Twizzle today
          </h3>
        </div>

        <div className="w-full space-y-4 max-w-[380px]">
          <Button
            variant="ghost"
            className="w-full h-12 rounded-full font-bold flex bg-white hover:bg-gray-100 text-black items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Sign up with Google
          </Button>

          <div className="flex items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-white/20 text-[10px] font-black tracking-widest uppercase">or</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <Link href="/signup" className="block w-full">
            <Button
              variant="twitter"
              className="w-full h-12 rounded-full font-bold text-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#1d9bf0]/20"
            >
              Create account
            </Button>
          </Link>

          <p className="text-[12px] text-white/40 leading-relaxed px-2">
            By signing up, you agree to the{" "}
            <span className="text-[#1d9bf0] hover:underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="text-[#1d9bf0] hover:underline cursor-pointer">Privacy Policy</span>, including{" "}
            <span className="text-[#1d9bf0] hover:underline cursor-pointer">Cookie Use</span>.
          </p>
        </div>

        <div className="pt-8 w-full max-w-[380px]">
          <h4 className="text-white font-bold mb-4">Already have an account?</h4>
          <Link href="/login" className="block w-full">
            <Button
              variant="outline"
              className="w-full h-12 rounded-full font-bold text-[#1d9bf0] border-white/10 hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
