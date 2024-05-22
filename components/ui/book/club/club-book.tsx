import { ClubType } from "@/utils/types"
import { Card, Skeleton } from "@/components/ui"
import { Spreads } from "@/components/ui/book"

interface Props {
	clubData: ClubType
	clubIndex: number
}

export function ClubBook({ clubData, clubIndex }: Props) {
	return (
		<div id={`club-${clubIndex}-wrapper`} className="max-w-sm md:max-w-4xl w-full space-y-3">
			<h1 id={`club-${clubIndex}-title`} className="font-bold text-lg md:text-3xl pl-1 truncate ...">
				{clubData.name}
			</h1>
			<Card id={`club-${clubIndex}-content`} className="h-[812px] md:h-[624px] p-4 rounded-3xl relative shadow-sm">
				<Spreads clubData={clubData} clubIndex={clubIndex} />
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
