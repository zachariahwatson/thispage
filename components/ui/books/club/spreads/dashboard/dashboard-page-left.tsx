"use client"

import { Card, CardHeader, CardTitle, Separator } from "@/components/ui"
import { InviteCodes, MemberList } from "@/components/ui/books/club/spreads/dashboard"
import { CreateInviteButton } from "@/components/ui/buttons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useClubMembership, useFirstLoadAnimation } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { motion, useMotionValue } from "framer-motion"
import { useState } from "react"

interface Props {
	userSpreadIndex: number
}

export function DashboardPageLeft({ userSpreadIndex }: Props) {
	const MotionCard = motion(Card)
	const [flipOnce, setFlipOnce] = useState<boolean>(false)
	const isVertical = useMediaQuery("(max-width: 768px)")
	const clubMembership = useClubMembership()
	const firstLoad = useFirstLoadAnimation()

	//framer motion responsive animation (turns book page flip into notepad page flip)
	const leftVariants = isVertical
		? {
				initial: { rotateX: flipOnce ? 0 : firstLoad?.firstLoad ? -90 : -180, originY: 1, zIndex: 2 },
				animate: { rotateX: 0, originY: 1, zIndex: 2 },
		  }
		: {
				initial: { rotateY: flipOnce ? 0 : firstLoad?.firstLoad ? 90 : 180, originX: 1, zIndex: 2 },
				animate: { rotateY: 0, originX: 1, zIndex: 2 },
		  }

	return (
		<MotionCard
			className="bg-background flex-1 h-1/2 md:h-full md:w-1/2 relative border-b-0 rounded-b-none md:border-b md:rounded-b-lg md:border-r-0 md:rounded-tr-none md:rounded-br-none shadow-shadow shadow-md"
			variants={leftVariants}
			initial="initial"
			animate="animate"
			transition={{ type: "tween", duration: firstLoad?.firstLoad ? 0.1 : 0.2, delay: 0.1, ease: "easeIn" }}
			style={{ transformPerspective: 2500 }}
			onAnimationComplete={() => {
				setFlipOnce(true)
			}}
			onUpdate={(latest) => {
				// Check if the animation has progressed past a certain point
				if (
					!firstLoad?.firstLoad &&
					((latest.rotateY && Number(latest.rotateY) < 90) || (latest.rotateX && Number(latest.rotateX) > -90))
				) {
					firstLoad?.setFirstLoad(true)
				}
			}}
		>
			{firstLoad?.firstLoad && (
				<CardHeader className="px-4 md:px-6 h-full">
					<CardTitle className="text-xl flex flex-row items-center">
						dashboard
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6 ml-2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
							/>
						</svg>
					</CardTitle>
					<Separator />

					<div className="space-y-1.5 h-full overflow-scroll pt-2 pr-1">
						<Tabs defaultValue="invites">
							<TabsList>
								<TabsTrigger value="invites">invites</TabsTrigger>
								<TabsTrigger value="members">members</TabsTrigger>
							</TabsList>
							<TabsContent value="invites">
								<div className="flex justify-between pr-1">
									<CardTitle className="text-lg">invites</CardTitle>
									{clubMembership?.role === "admin" && <CreateInviteButton />}
								</div>
								<InviteCodes />
							</TabsContent>
							<TabsContent value="members">
								<CardTitle className="text-lg">members</CardTitle>
								<MemberList />
							</TabsContent>
						</Tabs>
					</div>
				</CardHeader>
			)}
			<div className="bg-gradient-to-l from-shadow to-background py-2 hidden md:block absolute h-full top-0 right-0">
				<Separator orientation="vertical" className="ml-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-t from-shadow to-background px-2 block md:hidden absolute w-full bottom-0 right-0">
				<Separator orientation="horizontal" className="mt-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs hidden md:block text-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
