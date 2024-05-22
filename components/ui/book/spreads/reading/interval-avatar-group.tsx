import { IntervalType, ReadingType } from "@/utils/types"
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
} from "@/components/ui"
import { Tooltip } from "@/components/ui"
import { IntervalAvatarList } from "./interval-avatar-list"

interface Props {
	intervals: IntervalType[]
	userInterval: ReadingType["intervals"][0] | null
}

export function IntervalAvatarGroup({ intervals, userInterval }: Props) {
	const previewIntervals = intervals.slice(0, 5)
	return (
		<>
			<Dialog>
				<DialogTrigger>
					<CardTitle className="text-xl">members</CardTitle>
				</DialogTrigger>
				<DialogContent className="max-w-sm md:max-w-4xl w-full rounded-lg">
					<IntervalAvatarList intervals={intervals} userInterval={userInterval} />
				</DialogContent>
			</Dialog>
			<div className="flex flex-row -space-x-1">
				{previewIntervals.map((interval, index) => (
					<Tooltip key={interval.id}>
						<TooltipTrigger className="cursor-default">
							<Avatar
								className={`outline ${
									interval.isCompleted && userInterval ? "outline-ring outline-3" : "outline-background outline-4"
								} -outline-offset-1`}
							>
								<AvatarImage src={interval.member.profile.avatarUrl} />
								<AvatarFallback>
									{interval.member.profile.firstName && interval.member.profile.lastName
										? interval.member.profile.firstName[0] + interval.member.profile.lastName[0]
										: interval.member.profile.name.split(" ")[0] + interval.member.profile.name.split(" ")[1]}
								</AvatarFallback>
							</Avatar>
						</TooltipTrigger>
						<TooltipContent>
							{index !== 0
								? interval.member.profile.firstName && interval.member.profile.lastName
									? interval.member.profile.firstName + " " + interval.member.profile.lastName
									: interval.member.profile.name
								: "you"}
						</TooltipContent>
					</Tooltip>
				))}
				{intervals.length > previewIntervals.length && (
					<Dialog>
						<DialogTrigger>
							<Tooltip>
								<TooltipTrigger>
									<Avatar className="outline outline-background outline-4 -outline-offset-1">
										<AvatarFallback className=" bg-secondary">
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
								<TooltipContent>view all members</TooltipContent>
							</Tooltip>
						</DialogTrigger>
						<DialogContent className="max-w-sm md:max-w-4xl w-full rounded-lg">
							<IntervalAvatarList intervals={intervals} userInterval={userInterval} />
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
			<CardTitle className="text-xl">members</CardTitle>
			<div className="flex flex-row -space-x-1">
				<Skeleton className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full outline outline-background outline-4" />
				<Skeleton className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full outline outline-background outline-4" />
				<Skeleton className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full outline outline-background outline-4" />
				<Skeleton className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full outline outline-background outline-4" />
			</div>
		</>
	)
}
