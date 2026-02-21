import * as React from "react"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const hasValue = props.value && String(props.value).length > 0;

        return (
            <div className="w-full relative">
                <div
                    className={`
                relative border rounded border-gray-300 focus-within:border-[#1d9bf0] focus-within:ring-1 focus-within:ring-[#1d9bf0] rounded-[4px] bg-transparent
                ${error ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : ""}
            `}
                >
                    <div className="relative pt-5 pb-2 px-2">
                        <input
                            type={type}
                            className={`
                    block w-full bg-transparent border-0 p-0 text-gray-900 placeholder-transparent focus:ring-0 sm:text-sm focus:outline-none
                    ${className}
                `}
                            ref={ref}
                            {...props}
                            onFocus={(e) => {
                                setIsFocused(true);
                                props.onFocus?.(e);
                            }}
                            onBlur={(e) => {
                                setIsFocused(false);
                                props.onBlur?.(e);
                            }}
                        />
                        <label
                            className={`
                        absolute left-2 transition-all duration-200 ease-in-out pointer-events-none text-gray-500
                        ${(isFocused || hasValue || props.placeholder) ? "text-xs top-1" : "text-base top-3.5"}
                        ${error ? "text-red-500" : ""}
                        ${isFocused && !error ? "text-[#1d9bf0]" : ""}
                    `}
                        >
                            {label}
                        </label>
                    </div>
                </div>
                {error && (
                    <p className="mt-1 text-xs text-red-500 px-2">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
