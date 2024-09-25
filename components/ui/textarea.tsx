"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	initialCharacterCount?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, initialCharacterCount = 0, ...props }, ref) => {
		const [characterCount, setCharacterCount] = React.useState<number>(initialCharacterCount)

		const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
			setCharacterCount(event.target.value.length)
			if (props.onChange) {
				props.onChange(event) // Call the original onChange handler if it exists
			}
		}

		return (
			<div className="relative">
				<textarea
					className={cn(
						"flex min-h-[80px] w-full rounded-md border border-input bg-page px-3 py-2 text-sm ring-offset-page placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						className
					)}
					ref={ref}
					{...props}
					onChange={handleChange}
				/>
				<div className="text-xs text-muted-foreground absolute right-0 bottom-full mb-2">{characterCount}</div>
			</div>
		)
	}
)
Textarea.displayName = "Textarea"

export { Textarea }
