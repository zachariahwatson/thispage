import { IntervalType } from "@/utils/types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui"

interface Props {
	intervals: IntervalType[]
}

export function IntervalAvatarGroup({ intervals }: Props) {
	const previewIntervals = intervals.slice(0, 5)
	return (
		<div className="flex flex-row -space-x-1">
			{previewIntervals.map((interval) => (
				<Avatar
					key={interval.id}
					className={`outline ${interval.isCompleted ? "outline-ring outline-2" : "outline-background outline-4"}`}
				>
					<AvatarImage src={interval.member.profile.avatarUrl} />
					<AvatarFallback>
						{interval.member.profile.firstName && interval.member.profile.lastName
							? interval.member.profile.firstName[0] + interval.member.profile.lastName[0]
							: interval.member.profile.name.split(" ")[0] + interval.member.profile.name.split(" ")[1]}
					</AvatarFallback>
				</Avatar>
			))}
			{intervals.length > previewIntervals.length && (
				<Avatar className="outline outline-background outline-4">
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
			)}
		</div>
	)
}
