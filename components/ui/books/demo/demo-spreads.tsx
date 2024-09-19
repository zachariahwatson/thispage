"use client"

import { Card, Skeleton } from "@/components/ui/"
import { NextReading } from "@/components/ui/buttons"
import { DemoPollSpread, DemoReadingSpread, DemoSpread1, DemoSpread2 } from "@/components/ui/books/demo"
import { useState } from "react"
import { PageLeft } from "@/components/ui/books"

/**
 * returns a list of book club reading "spreads". we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function DemoSpreads() {
	const [userSpreadIndex, setUserSpreadIndex] = useState<number>(0)

	return (
		<Card className="h-[calc(100svh-56px)] min-h-[624px] md:h-[624px] p-3 md:p-4 rounded-3xl relative shadow-shadow shadow-sm bg-book border-book-border">
			<div className="relative w-full h-full border border-border shadow-md shadow-shadow-dark rounded-lg">
				<div className="absolute top-0 left-0 w-full h-full">
					<PageLeft disableAnimation />
				</div>
				<DemoSpread1 isVisible={userSpreadIndex === 0} userSpreadIndex={userSpreadIndex} />
				<DemoSpread2 isVisible={userSpreadIndex === 1} userSpreadIndex={userSpreadIndex} />
				<DemoReadingSpread isVisible={userSpreadIndex === 2} userSpreadIndex={userSpreadIndex} />
				<DemoPollSpread isVisible={userSpreadIndex === 3} userSpreadIndex={userSpreadIndex} />

				<NextReading userSpreadIndex={userSpreadIndex} setUserSpreadIndex={setUserSpreadIndex} len={4} />
			</div>
		</Card>
	)
}

export function SpreadSkeleton() {
	return <Skeleton className="h-full" />
}
