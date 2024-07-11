"use client"

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
import { useMediaQuery } from "@/hooks"
import { Interval, MemberProgress } from "@/lib/types"

interface Props {
	progresses: MemberProgress[]
}

export function IntervalAvatarList({ progresses }: Props) {
	return (
		<>
			<CardHeader>
				<CardTitle>readers</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[684px] border rounded-lg shadow-shadow shadow-inner">
					<div className="grid md:grid-cols-3 p-4">
						{progresses.map((progress, index) => (
							<div key={index} className="h-10 flex flex-row mr-8 mb-4">
								<Avatar className={`${progress?.is_complete ? "ring-ring" : "ring-background"} ring-4`}>
									<AvatarImage src={progress?.member?.avatar_url || ""} />
									<AvatarFallback>
										{progress?.member?.first_name && progress?.member?.last_name
											? progress?.member.first_name[0] + progress?.member.last_name[0]
											: progress?.member?.name &&
											  progress?.member?.name?.split(" ")[0] + progress?.member?.name?.split(" ")[1]}
									</AvatarFallback>
								</Avatar>
								<p className="ml-4 self-center">
									{progress?.member?.first_name && progress?.member?.last_name
										? progress?.member.first_name + " " + progress?.member.last_name
										: progress?.member?.name}
								</p>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</>
	)
}
