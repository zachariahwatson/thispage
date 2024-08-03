"use client"

// import { ReadingType, ReadingPostType } from "@/utils/types"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Progress,
	ScrollArea,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui"
import {
	IntervalAvatarGroup,
	IntervalAvatarGroupSkeleton,
	ReadingPageLeft,
	ReadingPageRight,
	ReadingPost,
	ReadingPostSkeleton,
} from "@/components/ui/book"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/buttons"
import Image from "next/image"
import { ScrollAreaElement } from "@radix-ui/react-scroll-area"
import { useQuery } from "react-query"
import type { ReadingPost as ReadingPostType } from "@/lib/types"
import { useClubMembership, useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { DemoReadingPost } from "."

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

interface Props {
	clicked: boolean
}

export function DemoReadingPosts({ clicked }: Props) {
	const [innerWidth, setInnerWidth] = useState<string | number>("auto")
	const [innerHeight, setInnerHeight] = useState<string | number>("auto")

	return (
		/**
		 * @todo - figure out why it's becoming display: table
		 */
		<div className="h-full">
			<ScrollArea className="border rounded-lg h-[calc(50svh-217px)] md:h-[418px] shadow-shadow shadow-inner">
				<div className="p-3 md:p-4" style={{ width: innerWidth, height: innerHeight }}>
					<DemoReadingPost likes={3}>what do you guys think so far?</DemoReadingPost>
					{clicked ? (
						<DemoReadingPost likes={1}>peekaboo!</DemoReadingPost>
					) : (
						<DemoReadingPost disabled likes={1}>
							⚠️spoiler⚠️complete the reading!
						</DemoReadingPost>
					)}

					<DemoReadingPost likes={5}>meeting dates + times</DemoReadingPost>
				</div>
			</ScrollArea>
		</div>
	)
}
