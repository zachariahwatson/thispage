import { Card, Skeleton } from "@/components/ui"
import { Spreads } from "@/components/ui/book"
import { ClubMembership } from "@/lib/types"

interface Props {
	clubMembershipData: ClubMembership
}

export function ClubBook({ clubMembershipData }: Props) {
	return (
		<div id={`club-${clubMembershipData.club.id}`} className="max-w-sm md:max-w-4xl w-full space-y-3">
			<h1 id={`club-${clubMembershipData.club.id}-title`} className="font-bold text-lg md:text-3xl pl-1 truncate ...">
				{clubMembershipData.club.name}
			</h1>
			<Card
				id={`club-${clubMembershipData.club.id}-content`}
				className="h-[calc(100vh-64px)] md:h-[624px] p-4 rounded-3xl relative shadow-shadow shadow-sm bg-secondary"
			>
				<Spreads clubMembershipData={clubMembershipData} />
			</Card>
		</div>
	)
}

export function ClubBookSkeleton() {
	return (
		<div className="max-w-sm md:max-w-4xl w-full space-y-3">
			<Skeleton className="h-[36px] w-[300px] pl-1"></Skeleton>
			<Skeleton className="h-[350px] md:h-[624px] p-4 rounded-3xl" />
		</div>
	)
}
