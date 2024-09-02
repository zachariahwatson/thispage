"use client"
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	showCharacterCount?: boolean
	initialCharacterCount?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, showCharacterCount = true, initialCharacterCount = 0, ...props }, ref) => {
		const [characterCount, setCharacterCount] = React.useState<number>(initialCharacterCount)

		const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			setCharacterCount(event.target.value.length)
			if (props.onChange) {
				props.onChange(event) // Call the original onChange handler if it exists
			}
		}
		return (
			<>
				<input
					type={type}
					className={cn(
						"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						className
					)}
					ref={ref}
					{...props}
					onInput={handleChange}
				/>
				{(!type || type === "password" || type === "text") && showCharacterCount && (
					<div className="text-right text-xs text-muted-foreground mt-1">{characterCount}</div>
				)}
			</>
		)
	}
)
Input.displayName = "Input"

export { Input }
