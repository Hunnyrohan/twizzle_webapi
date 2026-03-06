"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    variant?: 'floating' | 'standard';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, variant = 'floating', ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const [value, setValue] = React.useState(props.defaultValue || props.value || "");

        const isFloating = isFocused || (value && String(value).length > 0);

        const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
            props.onChange?.(e);
        };

        if (variant === 'standard') {
            return (
                <div className="w-full space-y-1 group">
                    {label && (
                        <label className="block text-[13px] font-medium text-gray-700 dark:text-zinc-400">
                            {label}
                        </label>
                    )}
                    <input
                        type={type}
                        className={`
                            block w-full px-3 h-9 rounded-md
                            text-gray-900 dark:text-white text-sm
                            bg-white dark:bg-zinc-950
                            border border-gray-300 dark:border-zinc-800
                            focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]/20 transition-all outline-none
                            ${error ? "border-red-500 focus:ring-red-500/20" : ""}
                            ${className}
                        `}
                        ref={ref}
                        {...props}
                        onChange={handleInput}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                    />
                    {error && (
                        <p className="text-[11px] text-red-600 mt-0.5 ml-0.5">
                            {error}
                        </p>
                    )}
                </div>
            );
        }

        return (
            <div className="w-full relative group">
                <div
                    className={`
                        relative border rounded-2xl transition-all duration-300 ease-out
                        ${isFocused
                            ? "bg-white border-[#1d9bf0] ring-8 ring-[#1d9bf0]/5 shadow-sm dark:bg-zinc-950"
                            : "bg-gray-50/70 border-gray-200 hover:border-gray-300 dark:bg-zinc-900/40 dark:border-zinc-800 dark:hover:border-zinc-700"}
                        ${error ? "border-red-400 bg-red-50/30 ring-8 ring-red-400/5" : ""}
                    `}
                >
                    <div className="relative pt-7 pb-3 px-6 min-h-[72px] flex items-center">
                        <input
                            id={props.id || label?.toLowerCase().replace(/\s+/g, '-')}
                            type={type}
                            className={`
                                block w-full bg-transparent border-0 p-0 
                                text-gray-950 dark:text-white text-[17px] font-bold tracking-tight
                                placeholder-transparent focus:ring-0 focus:outline-none
                                selection:bg-[#1d9bf0]/30
                                ${className}
                            `}
                            ref={ref}
                            {...props}
                            onChange={handleInput}
                            onFocus={(e) => {
                                setIsFocused(true);
                                props.onFocus?.(e);
                            }}
                            onBlur={(e) => {
                                setIsFocused(false);
                                props.onBlur?.(e);
                            }}
                        />

                        {label && (
                            <label
                                htmlFor={props.id || label.toLowerCase().replace(/\s+/g, '-')}
                                className={`
                                    absolute left-6 transition-all duration-250 ease-[0.2,1,0.3,1] pointer-events-none
                                    ${isFloating
                                        ? "text-[12px] top-3 text-[#1d9bf0] font-black uppercase tracking-widest"
                                        : "text-[17px] top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 font-bold"}
                                    ${error ? "text-red-500" : ""}
                                `}
                            >
                                {label}
                            </label>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-1.5 text-[12px] text-red-500 px-4 font-black uppercase tracking-wider"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
