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
	isComplete: boolean
}

export function DemoIntervalAvatarList({ isComplete }: Props) {
	return (
		<>
			<CardHeader>
				<CardTitle>readers</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[684px] border rounded-lg shadow-shadow shadow-inner">
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`${isComplete ? "ring-ring" : "ring-background"} ring-4`}>
								<AvatarImage src="/images/default-avatar.png" />
							</Avatar>
							<p className="ml-4 self-center">you</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`ring-ring ring-4`}>
								<AvatarImage src="/images/demo-avatar-1.png" />
							</Avatar>
							<p className="ml-4 self-center">Isaac Newton</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`ring-background ring-4`}>
								<AvatarImage src="/images/demo-avatar-2.png" />
							</Avatar>
							<p className="ml-4 self-center">Albert Einstein</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`ring-ring ring-4`}>
								<AvatarImage src="/images/demo-avatar-3.png" />
							</Avatar>
							<p className="ml-4 self-center">Nikola Tesla</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`ring-background ring-4`}>
								<AvatarImage src="/images/demo-avatar-4.png" />
							</Avatar>
							<p className="ml-4 self-center">Tycho Brahe</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`ring-ring ring-4`}>
								<AvatarImage src="/images/demo-avatar-5.png" />
							</Avatar>
							<p className="ml-4 self-center">Pythagoras</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`ring-ring ring-4`}>
								<AvatarImage src="/images/demo-avatar-6.png" />
							</Avatar>
							<p className="ml-4 self-center">Galileo Galilei</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`ring-background ring-4`}>
								<AvatarImage src="/images/demo-avatar-7.png" />
							</Avatar>
							<p className="ml-4 self-center">Carl Gauss</p>
						</div>
					</div>
				</ScrollArea>
			</CardContent>
		</>
	)
}
