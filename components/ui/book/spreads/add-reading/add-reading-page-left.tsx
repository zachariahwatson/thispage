"use client"

import { Card, CardContent, CardHeader, CardTitle, Separator } from "@/components/ui"
import { useClubMembership } from "@/contexts"

import { useMediaQuery } from "@/hooks"
import { InviteCode } from "@/lib/types"

import { motion } from "framer-motion"

import { useState } from "react"
import { useQuery } from "react-query"
import { InviteCodes } from "./invite-codes"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { MemberList } from "./member-list"
import { CreateInviteButton } from "@/components/ui/buttons"

interface Props {
	readingIndex: number
}

export function AddReadingPageLeft({ readingIndex }: Props) {
	const MotionCard = motion(Card)
	const [flipOnce, setFlipOnce] = useState<boolean>(false)
	const isVertical = useMediaQuery("(max-width: 768px)")

	//framer motion responsive animation (turns book page flip into notepad page flip)
	const leftVariants = isVertical
		? {
				initial: { rotateX: flipOnce ? 0 : -90, originY: 1, zIndex: 2 },
				animate: { rotateX: 0, originY: 1, zIndex: 2 },
		  }
		: {
				initial: { rotateY: flipOnce ? 0 : 90, originX: 1, zIndex: 2 },
				animate: { rotateY: 0, originX: 1, zIndex: 2 },
		  }

	return (
		<MotionCard
			className="bg-background flex-1 h-1/2 md:h-full md:w-1/2 relative border-b-0 rounded-b-none md:border-b md:rounded-b-lg md:border-r-0 md:rounded-tr-none md:rounded-br-none shadow-shadow shadow-md"
			variants={leftVariants}
			initial="initial"
			animate="animate"
			transition={{ type: "tween", duration: 0.1, delay: 0.1, ease: "easeIn" }}
			style={{ transformPerspective: 2500 }}
			onAnimationComplete={() => setFlipOnce(true)}
		>
			<CardHeader className="px-4 md:px-6 h-full">
				<CardTitle className="text-xl">dashboard</CardTitle>
				<Separator />

				<div className="space-y-1.5 h-full overflow-scroll pt-2 pr-1">
					<div className="flex justify-between pr-1">
						<CardTitle className="text-lg">invite codes</CardTitle>
						<CreateInviteButton />
					</div>
					<InviteCodes />
					<CardTitle className="text-lg">members</CardTitle>
					<MemberList />
				</div>
			</CardHeader>
			<div className="bg-gradient-to-l from-shadow to-background py-2 hidden md:block absolute h-full top-0 right-0">
				<Separator orientation="vertical" className="ml-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-t from-shadow to-background px-2 block md:hidden absolute w-full bottom-0 right-0">
				<Separator orientation="horizontal" className="mt-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs hidden md:block text-foreground/30">{readingIndex + 1}</p>
		</MotionCard>
	)
}
