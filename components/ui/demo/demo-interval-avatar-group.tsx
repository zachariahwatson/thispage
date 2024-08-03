"use client"

import {
	Avatar,
	AvatarImage,
	AvatarFallback,
	TooltipContent,
	TooltipTrigger,
	Dialog,
	DialogTrigger,
	DialogContent,
	Skeleton,
	CardTitle,
	Drawer,
	DrawerTrigger,
	DrawerTitle,
	DrawerContent,
} from "@/components/ui"
import { Tooltip } from "@/components/ui"
import { DemoIntervalAvatarList } from "./demo-interval-avatar-list"
import type { Interval, MemberProgress } from "@/lib/types"
import { useMediaQuery } from "@/hooks"

interface Props {
	isComplete: boolean
	clicked: boolean
}

export function DemoIntervalAvatarGroup({ isComplete, clicked }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	return (
		<>
			{isVertical ? (
				<Drawer>
					<DrawerTrigger>
						<DrawerTitle className="text-xl">readers</DrawerTitle>
					</DrawerTrigger>
					<DrawerContent className="w-full rounded-lg">
						<DemoIntervalAvatarList isComplete={isComplete} clicked={clicked} />
					</DrawerContent>
				</Drawer>
			) : (
				<Dialog>
					<DialogTrigger>
						<CardTitle className="text-xl">readers</CardTitle>
					</DialogTrigger>
					<DialogContent className="max-w-sm md:max-w-4xl w-full rounded-lg">
						<DemoIntervalAvatarList isComplete={isComplete} clicked={clicked} />
					</DialogContent>
				</Dialog>
			)}

			<div className="flex flex-row -space-x-1">
				<Tooltip>
					<TooltipTrigger className="cursor-default">
						<Avatar className={`${isComplete ? "ring-ring" : "ring-background"} ring-4`}>
							<AvatarImage src="/images/default-avatar.png" loading="eager" />
						</Avatar>
					</TooltipTrigger>
					<TooltipContent>Lorem Ipsum</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger className="cursor-default">
						<Avatar className={`${!clicked ? "ring-ring" : "ring-background"} ring-4`}>
							<AvatarImage src="/images/default-avatar.png" loading="eager" />
						</Avatar>
					</TooltipTrigger>
					<TooltipContent>Lorem Ipsum</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger className="cursor-default">
						<Avatar className={`${!clicked ? "ring-ring" : "ring-background"} ring-4`}>
							<AvatarImage src="/images/default-avatar.png" loading="eager" />
						</Avatar>
					</TooltipTrigger>
					<TooltipContent>Lorem Ipsum</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger className="cursor-default">
						<Avatar className={`${!clicked ? "ring-ring" : "ring-background"} ring-4`}>
							<AvatarImage src="/images/default-avatar.png" loading="eager" />
						</Avatar>
					</TooltipTrigger>
					<TooltipContent>Lorem Ipsum</TooltipContent>
				</Tooltip>
				{isVertical ? (
					<Drawer>
						<DrawerTrigger>
							<Avatar className="ring-background ring-4">
								<AvatarFallback>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
										/>
									</svg>
								</AvatarFallback>
							</Avatar>
						</DrawerTrigger>
						<DrawerContent className="w-full rounded-lg">
							<DemoIntervalAvatarList isComplete={isComplete} clicked={clicked} />
						</DrawerContent>
					</Drawer>
				) : (
					<Dialog>
						<Tooltip>
							<TooltipTrigger>
								<DialogTrigger>
									<Avatar className="ring-background ring-4">
										<AvatarFallback>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="w-6 h-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
												/>
											</svg>
										</AvatarFallback>
									</Avatar>
								</DialogTrigger>
							</TooltipTrigger>
							<TooltipContent>view all readers</TooltipContent>
						</Tooltip>
						<DialogContent className="max-w-sm md:max-w-4xl w-full rounded-lg">
							<DemoIntervalAvatarList isComplete={isComplete} clicked={clicked} />
						</DialogContent>
					</Dialog>
				)}
			</div>
		</>
	)
}

export function IntervalAvatarGroupSkeleton() {
	return (
		<>
			<CardTitle className="text-xl">readers</CardTitle>
			<div className="flex flex-row -space-x-1">
				<Skeleton className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full outline outline-background outline-4" />
				<Skeleton className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full outline outline-background outline-4" />
				<Skeleton className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full outline outline-background outline-4" />
				<Skeleton className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full outline outline-background outline-4" />
			</div>
		</>
	)
}
