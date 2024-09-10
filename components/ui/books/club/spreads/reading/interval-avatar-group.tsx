"use client"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	CardTitle,
	Dialog,
	DialogContent,
	DialogTrigger,
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
	Skeleton,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui"
import { IntervalAvatarList } from "@/components/ui/books/club/spreads/reading"
import { useMediaQuery } from "@/hooks"
import type { MemberProgress } from "@/lib/types"

interface Props {
	progresses?: (MemberProgress | undefined)[]
}

export function IntervalAvatarGroup({ progresses }: Props) {
	const previewProgresses = progresses?.slice(0, 7)
	const isVertical = useMediaQuery("(max-width: 768px)")
	return (
		<>
			{isVertical ? (
				<Sheet>
					<SheetTrigger>
						<SheetTitle className="text-md md:text-xl">readers</SheetTitle>
					</SheetTrigger>
					<SheetContent className="sm:max-w-xl max-w-xl w-full rounded-lg">
						<IntervalAvatarList progresses={progresses} />
					</SheetContent>
				</Sheet>
			) : (
				<Dialog>
					<DialogTrigger>
						<CardTitle className="text-md md:text-xl">readers</CardTitle>
					</DialogTrigger>
					<DialogContent className="max-w-sm md:max-w-4xl w-full rounded-lg">
						<IntervalAvatarList progresses={progresses} />
					</DialogContent>
				</Dialog>
			)}

			<div className="flex flex-row -space-x-1">
				{previewProgresses?.map(
					(progress, index) =>
						progress && (
							<Tooltip key={index}>
								<TooltipTrigger className="cursor-default">
									<Avatar
										className={`${
											progress?.is_complete ? "ring-ring ring-4" : "ring-background ring-4"
										} size-8 md:size-10`}
									>
										<AvatarImage src={progress?.member?.avatar_url || ""} loading="eager" />
										<AvatarFallback>
											{progress?.member?.first_name && progress?.member?.last_name
												? progress?.member.first_name[0] + progress?.member.last_name[0]
												: progress?.member?.name &&
												  progress?.member?.name?.split(" ")[0][0] + progress?.member?.name?.split(" ")[1][0]}
										</AvatarFallback>
									</Avatar>
								</TooltipTrigger>
								<TooltipContent>
									{progress?.member?.first_name && progress?.member?.last_name
										? progress?.member.first_name + " " + progress?.member.last_name
										: progress?.member?.name}
								</TooltipContent>
							</Tooltip>
						)
				)}
				{progresses && previewProgresses && progresses.length > previewProgresses.length && (
					<>
						{isVertical ? (
							<Sheet>
								<SheetTrigger>
									<Avatar className="ring-background ring-4 size-8 md:size-10">
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
								</SheetTrigger>
								<SheetContent className="sm:max-w-xl max-w-xl w-full rounded-lg">
									<IntervalAvatarList progresses={progresses} />
								</SheetContent>
							</Sheet>
						) : (
							<Dialog>
								<Tooltip>
									<DialogTrigger asChild>
										<TooltipTrigger>
											<Avatar className="ring-background ring-4 size-8 md:size-10">
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
										</TooltipTrigger>
									</DialogTrigger>
									<TooltipContent>view all readers</TooltipContent>
								</Tooltip>
								<DialogContent className="max-w-sm md:max-w-4xl w-full rounded-lg">
									<IntervalAvatarList progresses={progresses} />
								</DialogContent>
							</Dialog>
						)}
					</>
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
