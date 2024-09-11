"use client"

import { Skeleton } from "@/components/ui/"
import { NextReading } from "@/components/ui/buttons"
import { ThemePollSpread, ThemeReadingSpread } from "@/components/ui/themes"
import { useState } from "react"

/**
 * returns a list of book club reading "spreads". we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function ThemeSpreads() {
	const [userSpreadIndex, setUserSpreadIndex] = useState<number>(0)

	return (
		<>
			<ThemeReadingSpread isVisible={userSpreadIndex === 0} userSpreadIndex={userSpreadIndex} />
			<ThemePollSpread isVisible={userSpreadIndex === 1} userSpreadIndex={userSpreadIndex} />

			<NextReading userSpreadIndex={userSpreadIndex} setUserSpreadIndex={setUserSpreadIndex} len={2} />
		</>
	)
}

export function SpreadSkeleton() {
	return <Skeleton className="h-full" />
}
