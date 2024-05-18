import { ClubType } from "@/utils/types"
import { Card } from "@/components/ui"
import { Suspense, useOptimistic, useState } from "react"
import { SpreadSkeleton } from "./index"
import { SpreadsSuspense } from "@/components/ui/book"

interface Props {
	clubData: ClubType
	clubIndex: number
}

export function ClubBook({ clubData, clubIndex }: Props) {
	return (
		<div id={`club-${clubIndex}-wrapper`} className="max-w-sm md:max-w-4xl w-full space-y-3">
			<h1 id={`club-${clubIndex}-title`} className="font-bold text-2xl md:text-3xl pl-1 truncate ...">
				{clubData.name}
			</h1>
			<Card id={`club-${clubIndex}-content`} className="h-[350px] md:h-[624px] p-4 rounded-3xl">
				<Suspense fallback={<SpreadSkeleton />}>
					<SpreadsSuspense clubData={clubData} clubIndex={clubIndex} />
				</Suspense>
			</Card>
		</div>
	)
}
