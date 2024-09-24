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
import { useTempTheme } from "@/contexts"
import { Paintbrush, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function ThemeButton() {
	const router = useRouter()
	const { tempTheme, setTempTheme } = useTempTheme()
	const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null>(null)

	const handleMouseEnter = () => {
		if (delayHandler) clearTimeout(delayHandler)
	}

	const handleMouseLeave = () => {
		setDelayHandler(
			setTimeout(() => {
				setTempTheme("")
			}, 250)
		)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Palette />

					<span className="sr-only">toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				sideOffset={16}
				className={tempTheme}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
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
				<ThemeItem id={"azul"}>azul</ThemeItem>
				<ThemeItem id={"botanical"}>botanical</ThemeItem>
				<ThemeItem id={"dawn"}>dawn</ThemeItem>
				<ThemeItem id={"industrial"}>industrial</ThemeItem>
				<ThemeItem id={"old-salt"}>old salt</ThemeItem>
				<ThemeItem id={"solarized-light"}>solarized light</ThemeItem>
				<ThemeItem id={"sticky-note"}>sticky note</ThemeItem>
				<ThemeItem id={"supertoy"}>supertoy</ThemeItem>
				<ThemeItem id={"wireframe"}>wireframe</ThemeItem>
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
				<ThemeItem id={"cherry"}>cherry</ThemeItem>
				<ThemeItem id={"depths"}>depths</ThemeItem>
				<ThemeItem id={"dualshot"}>dualshot</ThemeItem>
				<ThemeItem id={"gruvbox-dark"}>gruvbox dark</ThemeItem>
				<ThemeItem id={"laser"}>laser</ThemeItem>
				<ThemeItem id={"monokai"}>monokai</ThemeItem>
				<ThemeItem id={"solarized-dark"}>solarized dark</ThemeItem>
				<ThemeItem id={"synthwave-84"}>synthwave '84</ThemeItem>
				<ThemeItem id={"tokyo"}>tokyo</ThemeItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push("/themes")}>
					theme tool
					<Paintbrush className="size-5 ml-2" />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function ThemeItem({ id, children }: { id: string; children: React.ReactNode }) {
	const { theme, setTheme } = useTheme()
	const { setTempTheme } = useTempTheme()
	const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null>(null)
	const [mounted, setMounted] = useState(false)

	const handleOnClick = () => {
		setTheme(id)
	}

	const handleMouseEnter = () => {
		setDelayHandler(
			setTimeout(() => {
				setTempTheme(id)
			}, 250)
		)
	}

	const handleMouseLeave = () => {
		if (delayHandler) clearTimeout(delayHandler)
	}

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<DropdownMenuItem
			onClick={handleOnClick}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={theme === id ? "text-primary" : ""}
		>
			{children}
			{theme === id && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-4 ml-2"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
				</svg>
			)}
		</DropdownMenuItem>
	)
}
