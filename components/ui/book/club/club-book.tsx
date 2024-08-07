"use client"

import { Card, Skeleton } from "@/components/ui"
import { Spreads } from "@/components/ui/book"
import { ClubMembershipProvider, useClubMembership } from "@/contexts"
import { ClubMembership } from "@/lib/types"
import { createContext, useContext } from "react"

export function ClubBook() {
	const clubMembership = useClubMembership()
	return (
		<div id={`club-${clubMembership?.club.id}`} className="max-w-sm md:max-w-4xl w-full space-y-3">
			<h1 id={`club-${clubMembership?.club.id}-title`} className="font-bold text-lg md:text-3xl pl-1 truncate ...">
				{clubMembership?.club.name}
			</h1>
			<Card
				id={`club-${clubMembership?.club.id}-content`}
				className="h-[calc(100svh-64px)] min-h-[624px] md:h-[624px] p-4 rounded-3xl relative shadow-shadow shadow-sm bg-card"
			>
				<Spreads />
			</Card>
		</div>
	)
}

export function ClubBookSkeleton() {
	return (
		<div className="max-w-sm md:max-w-4xl w-full space-y-3">
			<Skeleton className="h-[36px] w-[300px] pl-1"></Skeleton>
			<Skeleton className="h-[calc(100svh-64px)] min-h-[624px] md:h-[624px] p-4 rounded-3xl" />
		</div>
	)
}
