import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	ScrollArea,
} from "@/components/ui"
import { IntervalType, ReadingType } from "@/utils/types"

interface Props {
	intervals: IntervalType[]
	userInterval: ReadingType["intervals"][0] | null
}

export function IntervalAvatarList({ intervals, userInterval }: Props) {
	return (
		<>
			<CardHeader>
				<CardTitle>members</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[684px] border rounded-lg shadow-inner">
					<div className="grid md:grid-cols-3 p-4">
						{intervals.map((interval, index) => (
							<div key={interval.id} className="h-10 flex flex-row mr-8 mb-4">
								<Avatar
									key={interval.id}
									className={`outline ${
										interval.isCompleted && userInterval ? "outline-ring outline-3" : "outline-background outline-4"
									} outline-offset-2`}
								>
									<AvatarImage src={interval.member.profile.avatarUrl} />
									<AvatarFallback>
										{interval.member.profile.firstName && interval.member.profile.lastName
											? interval.member.profile.firstName[0] + interval.member.profile.lastName[0]
											: interval.member.profile.name.split(" ")[0] + interval.member.profile.name.split(" ")[1]}
									</AvatarFallback>
								</Avatar>
								<p className="ml-4 self-center">
									{index !== 0
										? interval.member.profile.firstName && interval.member.profile.lastName
											? interval.member.profile.firstName + " " + interval.member.profile.lastName
											: interval.member.profile.name
										: "you"}
								</p>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</>
	)
}
