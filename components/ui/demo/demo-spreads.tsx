"use client"

import { Skeleton } from "@/components/ui/"
import { NextReading } from "@/components/ui/buttons"
import { DemoReadingSpread, DemoSpread1, DemoSpread2 } from "@/components/ui/demo"
import { useState } from "react"

/**
 * returns a list of book club reading "spreads". we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function DemoSpreads() {
	const [readingIndex, setReadingIndex] = useState<number>(0)

	return (
		<>
			<DemoSpread1 isVisible={readingIndex === 0} readingIndex={readingIndex} />
			<DemoSpread2 isVisible={readingIndex === 1} readingIndex={readingIndex} />
			<DemoReadingSpread isVisible={readingIndex === 2} readingIndex={readingIndex} />
			{/* {readingIndex === 3 && (
				<div className="h-full flex flex-col md:flex-row rounded-lg bg-background">
					<LoginPageLeft readingIndex={readingIndex} />
					<LoginPageRight />
				</div>
			)} */}

			<NextReading readingIndex={readingIndex} setReadingIndex={setReadingIndex} len={3} />
		</>
	)
}

export function SpreadSkeleton() {
	return <Skeleton className="h-full" />
}
