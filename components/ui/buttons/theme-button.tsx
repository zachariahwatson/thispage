"use client"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Separator,
} from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import * as React from "react"

export function ThemeButton() {
	const { setTheme } = useTheme()
	const router = useRouter()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"
						/>
					</svg>

					<span className="sr-only">toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={16}>
				<DropdownMenuLabel className="flex justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
						/>
					</svg>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => setTheme("industrial")}>industrial</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("supertoy")}>supertoy</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("old-salt")}>old salt</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dawn")}>dawn</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("sticky-note")}>sticky note</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("wireframe")}>wireframe</DropdownMenuItem>
				{/*
				<DropdownMenuItem onClick={() => setTheme("kiss")}>kiss</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("lilac")}>lilac</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("sky")}>sky</DropdownMenuItem> */}
				<DropdownMenuSeparator />
				<DropdownMenuLabel className="flex justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
						<path
							fillRule="evenodd"
							d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
							clipRule="evenodd"
						/>
					</svg>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => setTheme("cherry")}>cherry</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("cyber")}>cyber</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("terminal-green")}>terminal - green</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("terminal-orange")}>terminal - orange</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("blueprint")}>blueprint</DropdownMenuItem>
				{/*
				<DropdownMenuItem onClick={() => setTheme("tokyo")}>tokyo</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("cyber")}>cyber</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("depths")}>depths</DropdownMenuItem> */}
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push("/themes")}>
					theme tool
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-5 ml-2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
						/>
					</svg>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
