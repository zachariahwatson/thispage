"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/"
import Link from "next/link"

export function Nav({ user }: { user: any }) {
	return (
		<header className="flex justify-center border-b">
			<div className="px-8 py-4 flex flex-row items-center w-full justify-between max-w-lg md:max-w-5xl">
				<div className="flex flex-row space-x-8 items-center ">
					<Link href="/" className="text-2xl">
						this<span className="font-bold">page</span>
					</Link>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-10 h-10 hover:bg-secondary p-2 rounded-md transition-all"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"
								/>
							</svg>
						</DropdownMenuTrigger>
						<DropdownMenuContent sideOffset={16}>
							<DropdownMenuLabel>themes</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>dark</DropdownMenuItem>
							<DropdownMenuItem>light</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger>
						{user && (
							<Avatar className="self-end hover:ring-4 hover:ring-secondary transition-all">
								<AvatarImage src={user.user_metadata.avatar_url} />
								<AvatarFallback>
									{user.user_metadata.name.split(" ")[0] + user.user_metadata.name.split(" ")[1]}
								</AvatarFallback>
							</Avatar>
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" sideOffset={16}>
						<DropdownMenuItem>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
								<path
									fillRule="evenodd"
									d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
									clipRule="evenodd"
								/>
							</svg>
							create a club
						</DropdownMenuItem>
						<DropdownMenuItem>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
								<path
									fillRule="evenodd"
									d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
									clipRule="evenodd"
								/>
							</svg>
							settings
						</DropdownMenuItem>
						<DropdownMenuItem>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
								<path
									fillRule="evenodd"
									d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
									clipRule="evenodd"
								/>
							</svg>
							sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}
