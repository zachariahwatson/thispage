"use client"

// import { ReadingType, ReadingPostType } from "@/utils/types"
import { ScrollArea } from "@/components/ui"
import { useState } from "react"
import { DemoReadingPost } from "@/components/ui/books/demo"

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
		<div className="border rounded-lg h-full shadow-shadow shadow-inner w-full overflow-y-scroll">
			<div className="p-3 md:p-4 w-full h-auto">
				<DemoReadingPost likes={3} id={1}>
					what do you guys think so far?
				</DemoReadingPost>
				{clicked ? (
					<DemoReadingPost likes={1} id={2}>
						peekaboo!
					</DemoReadingPost>
				) : (
					<DemoReadingPost disabled likes={1} id={2}>
						⚠️spoiler⚠️complete the reading!
					</DemoReadingPost>
				)}

				<DemoReadingPost likes={5} id={3}>
					meeting dates + times
				</DemoReadingPost>
			</div>
		</div>
	)
}
