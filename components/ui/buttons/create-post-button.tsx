import { useMediaQuery } from "@/hooks"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../drawer"
import { Dialog, DialogContent, DialogTrigger } from "../dialog"
import { Tooltip, TooltipTrigger, TooltipContent } from "../tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../sheet"

export function CreatePostButton() {
	const isVertical = useMediaQuery("(max-width: 768px)")
	return (
		<>
			{isVertical ? (
				<Drawer>
					<Tooltip>
						<TooltipTrigger>
							<DrawerTrigger>
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
										d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
									/>
								</svg>
							</DrawerTrigger>
						</TooltipTrigger>
						<TooltipContent>create post</TooltipContent>
					</Tooltip>
					<DrawerContent className="w-full rounded-lg">
						<DrawerHeader>
							<DrawerTitle>create post</DrawerTitle>
						</DrawerHeader>
					</DrawerContent>
				</Drawer>
			) : (
				<Sheet>
					<Tooltip>
						<TooltipTrigger>
							<SheetTrigger>
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
										d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
									/>
								</svg>
							</SheetTrigger>
						</TooltipTrigger>
						<TooltipContent>create post</TooltipContent>
					</Tooltip>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>create post</SheetTitle>
						</SheetHeader>
					</SheetContent>
				</Sheet>
			)}
		</>
	)
}
