"use client"

import { Skeleton } from "@/components/ui"

export function ClubBookSkeleton() {
	return (
		<div className="max-w-sm md:max-w-4xl w-full space-y-3">
			<Skeleton className="h-[36px] w-[300px] pl-1"></Skeleton>
			<Skeleton className="h-[350px] md:h-[624px] p-4 rounded-3xl" />
		</div>
	)
}
