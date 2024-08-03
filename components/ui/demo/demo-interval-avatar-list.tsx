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
	clicked: boolean
}

export function DemoIntervalAvatarList({ isComplete, clicked }: Props) {
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
							<p className="ml-4 self-center">Lorem Ipsum</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`${!clicked ? "ring-ring" : "ring-background"} ring-4`}>
								<AvatarImage src="/images/default-avatar.png" />
							</Avatar>
							<p className="ml-4 self-center">Lorem Ipsum</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`${!clicked ? "ring-ring" : "ring-background"} ring-4`}>
								<AvatarImage src="/images/default-avatar.png" />
							</Avatar>
							<p className="ml-4 self-center">Lorem Ipsum</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`${!clicked ? "ring-ring" : "ring-background"} ring-4`}>
								<AvatarImage src="/images/default-avatar.png" />
							</Avatar>
							<p className="ml-4 self-center">Lorem Ipsum</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`${!clicked ? "ring-ring" : "ring-background"} ring-4`}>
								<AvatarImage src="/images/default-avatar.png" />
							</Avatar>
							<p className="ml-4 self-center">Lorem Ipsum</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`${!clicked ? "ring-ring" : "ring-background"} ring-4`}>
								<AvatarImage src="/images/default-avatar.png" />
							</Avatar>
							<p className="ml-4 self-center">Lorem Ipsum</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`${!clicked ? "ring-ring" : "ring-background"} ring-4`}>
								<AvatarImage src="/images/default-avatar.png" />
							</Avatar>
							<p className="ml-4 self-center">Lorem Ipsum</p>
						</div>
					</div>
					<div className="grid md:grid-cols-3 p-4">
						<div className="h-10 flex flex-row mr-8 mb-4">
							<Avatar className={`${!clicked ? "ring-ring" : "ring-background"} ring-4`}>
								<AvatarImage src="/images/default-avatar.png" />
							</Avatar>
							<p className="ml-4 self-center">Lorem Ipsum</p>
						</div>
					</div>
				</ScrollArea>
			</CardContent>
		</>
	)
}
