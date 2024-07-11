"use client"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	SettingsForm,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useRef, useState } from "react"
import { useMediaQuery } from "@/hooks"
import { DialogTriggerProps } from "@radix-ui/react-dialog"
import { toast } from "sonner"
import { signOut } from "@/actions/login"
import { ThemeButton } from "./buttons"
import { useUser } from "@/hooks/state"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function Nav() {
	const [settingsVisible, setSettingsVisible] = useState<boolean>(false)
	const isVertical = useMediaQuery("(max-width: 768px)")
	const settingsRef = useRef<HTMLButtonElement>(null)
	const queryClient = useQueryClient()
	const { data: user, isLoading: loading } = useUser()

	const settingsMutation = useMutation({
		mutationFn: (data: { first_name: string; last_name: string }) => {
			const url = new URL(`${defaultUrl}/api/users`)
			return fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
		},
		onSuccess: () => {
			toast.success("user successfully updated")
			queryClient.invalidateQueries(["intervals"])
			queryClient.invalidateQueries(["user"])
			queryClient.invalidateQueries(["user progress"])
			queryClient.invalidateQueries(["posts"])
			queryClient.invalidateQueries(["comments"])
		},
	})

	return (
		<header className="flex justify-center border-b bg-card">
			<div className="px-6 md:px-8 py-4 flex flex-row items-center w-full justify-between max-w-5xl">
				<div className="flex flex-row space-x-4 items-center ">
					<Link href="/" className="text-2xl">
						this<span className="font-bold">page</span>
					</Link>
					<ThemeButton />
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger>
						{user && !loading && (
							<Avatar className="self-end hover:ring-4 hover:ring-ring transition-all">
								<AvatarImage src={user.avatar_url} />
								<AvatarFallback>
									{user.first_name && user.last_name
										? user.first_name[0] + user.last_name[0]
										: user.name && user.name?.split(" ")[0] + user.name?.split(" ")[1]}
								</AvatarFallback>
							</Avatar>
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" sideOffset={16}>
						<DropdownMenuItem className="cursor-pointer">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
								<path
									fillRule="evenodd"
									d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
									clipRule="evenodd"
								/>
							</svg>
							create a club
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer" onSelect={() => settingsRef?.current?.click()}>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
								<path
									fillRule="evenodd"
									d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
									clipRule="evenodd"
								/>
							</svg>
							settings
						</DropdownMenuItem>
						<DropdownMenuItem
							className="cursor-pointer"
							onSelect={async () => {
								await signOut()
								queryClient.invalidateQueries(["user"])
							}}
						>
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
			{isVertical ? (
				<Drawer open={settingsVisible} onOpenChange={setSettingsVisible}>
					<DrawerTrigger ref={settingsRef} />
					<DrawerContent className="w-full p-6">
						<DrawerHeader>
							<DrawerTitle>settings</DrawerTitle>
						</DrawerHeader>
						<SettingsForm mutation={settingsMutation} setVisible={setSettingsVisible} />
					</DrawerContent>
				</Drawer>
			) : (
				<Sheet open={settingsVisible} onOpenChange={setSettingsVisible}>
					<SheetTrigger ref={settingsRef} />
					<SheetContent className="space-y-4">
						<SheetHeader>
							<SheetTitle>settings</SheetTitle>
						</SheetHeader>
						<SettingsForm mutation={settingsMutation} setVisible={setSettingsVisible} />
					</SheetContent>
				</Sheet>
			)}
		</header>
	)
}
