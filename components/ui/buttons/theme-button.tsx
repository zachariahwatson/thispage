"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/buttons/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "../separator"

export function ThemeButton() {
	const { setTheme } = useTheme()

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
			<DropdownMenuContent align="center" sideOffset={16}>
				<DropdownMenuItem onClick={() => setTheme("light")}>light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("note")}>note</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dawn")}>dawn</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("kiss")}>kiss</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("lilac")}>lilac</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("sky")}>sky</DropdownMenuItem>
				<Separator />
				<DropdownMenuItem onClick={() => setTheme("terminal")}>terminal</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("tokyo")}>tokyo</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("cyber")}>cyber</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("mainframe")}>mainframe</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("cherry")}>cherry</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("depths")}>depths</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
