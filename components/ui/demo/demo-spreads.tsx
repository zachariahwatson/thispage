"use client"

import { Skeleton } from "@/components/ui/"
import { NextReading } from "@/components/ui/buttons"
import { DemoReadingSpread, DemoSpread1, DemoSpread2 } from "@/components/ui/demo"
import { useState } from "react"

/**
 * returns a list of book club reading "spreads". we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function DemoSpreads() {
	const [userSpreadIndex, setUserSpreadIndex] = useState<number>(0)

	return (
		<>
			<DemoSpread1 isVisible={userSpreadIndex === 0} userSpreadIndex={userSpreadIndex} />
			<DemoSpread2 isVisible={userSpreadIndex === 1} userSpreadIndex={userSpreadIndex} />
			<DemoReadingSpread isVisible={userSpreadIndex === 2} userSpreadIndex={userSpreadIndex} />
			{/* {userSpreadIndex === 3 && (
				<div className="h-full flex flex-col md:flex-row rounded-lg bg-background">
					<LoginPageLeft userSpreadIndex={userSpreadIndex} />
					<LoginPageRight />
				</div>
			)} */}

			<NextReading userSpreadIndex={userSpreadIndex} setUserSpreadIndex={setUserSpreadIndex} len={3} />
		</>
	)
}

export function SpreadSkeleton() {
	return <Skeleton className="h-full" />
}
