"use client"

import { ScrollArea } from "@/components/ui"
import { useState } from "react"
import { ThemeReadingPost } from "."

interface Props {
	clicked: boolean
}

export function ThemeReadingPosts({ clicked }: Props) {
	const [innerWidth, setInnerWidth] = useState<string | number>("auto")
	const [innerHeight, setInnerHeight] = useState<string | number>("auto")

	return (
		/**
		 * @todo - figure out why it's becoming display: table
		 */
		<div className="h-full">
			<div className="border rounded-lg h-full shadow-shadow shadow-inner w-full overflow-y-scroll">
				<div className="p-3 md:p-4 w-full h-auto">
					<ThemeReadingPost likes={3} id={1}>
						what do you guys think so far?
					</ThemeReadingPost>
					{clicked ? (
						<ThemeReadingPost likes={1} id={2}>
							peekaboo!
						</ThemeReadingPost>
					) : (
						<ThemeReadingPost disabled likes={1} id={2}>
							⚠️spoiler⚠️complete the reading!
						</ThemeReadingPost>
					)}

					<ThemeReadingPost likes={5} id={3}>
						meeting dates + times
					</ThemeReadingPost>
				</div>
			</div>
		</div>
	)
}
