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
import { useState } from "react"

export function ThemeButton() {
	const { setTheme } = useTheme()
	const router = useRouter()
	const { tempTheme, setTempTheme } = useTempTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Palette />

					<span className="sr-only">toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={16} className={tempTheme}>
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
				<DropdownMenuItem
					onClick={() => setTheme("azul")}
					onMouseEnter={() => setTempTheme("azul")}
					onMouseLeave={() => setTempTheme("")}
				>
					azul
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("dawn")}
					onMouseEnter={() => setTempTheme("dawn")}
					onMouseLeave={() => setTempTheme("")}
				>
					dawn
				</DropdownMenuItem>
				{/* <DropdownMenuItem onClick={() => setTheme("gruvbox-light")}>gruvbox light</DropdownMenuItem> */}
				<DropdownMenuItem
					onClick={() => setTheme("industrial")}
					onMouseEnter={() => setTempTheme("industrial")}
					onMouseLeave={() => setTempTheme("")}
				>
					industrial
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("old-salt")}
					onMouseEnter={() => setTempTheme("old-salt")}
					onMouseLeave={() => setTempTheme("")}
				>
					old salt
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("solarized-light")}
					onMouseEnter={() => setTempTheme("solarized-light")}
					onMouseLeave={() => setTempTheme("")}
				>
					solarized light
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("sticky-note")}
					onMouseEnter={() => setTempTheme("sticky-note")}
					onMouseLeave={() => setTempTheme("")}
				>
					sticky note
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("supertoy")}
					onMouseEnter={() => setTempTheme("supertoy")}
					onMouseLeave={() => setTempTheme("")}
				>
					supertoy
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("wireframe")}
					onMouseEnter={() => setTempTheme("wireframe")}
					onMouseLeave={() => setTempTheme("")}
				>
					wireframe
				</DropdownMenuItem>
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
				<DropdownMenuItem
					onClick={() => setTheme("cherry")}
					onMouseEnter={() => setTempTheme("cherry")}
					onMouseLeave={() => setTempTheme("")}
				>
					cherry
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("depths")}
					onMouseEnter={() => setTempTheme("depths")}
					onMouseLeave={() => setTempTheme("")}
				>
					depths
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("dualshot")}
					onMouseEnter={() => setTempTheme("dualshot")}
					onMouseLeave={() => setTempTheme("")}
				>
					dualshot
				</DropdownMenuItem>
				{/* <DropdownMenuItem onClick={() => setTheme("gruvbox-dark")}>gruvbox dark</DropdownMenuItem> */}
				<DropdownMenuItem
					onClick={() => setTheme("monokai")}
					onMouseEnter={() => setTempTheme("monokai")}
					onMouseLeave={() => setTempTheme("")}
				>
					monokai
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("solarized-dark")}
					onMouseEnter={() => setTempTheme("solarized-dark")}
					onMouseLeave={() => setTempTheme("")}
				>
					solarized dark
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("synthwave-84")}
					onMouseEnter={() => setTempTheme("synthwave-84")}
					onMouseLeave={() => setTempTheme("")}
				>
					synthwave '84
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("tokyo")}
					onMouseEnter={() => setTempTheme("tokyo")}
					onMouseLeave={() => setTempTheme("")}
				>
					tokyo
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push("/themes")}>
					theme tool
					<Paintbrush className="size-5 ml-2" />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
