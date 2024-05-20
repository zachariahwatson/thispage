import { ClubType } from "@/utils/types"
import { Card } from "@/components/ui"
import { Spreads } from "@/components/ui/book"

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
			<Card id={`club-${clubIndex}-content`} className="h-[812px] md:h-[624px] p-4 rounded-3xl relative">
				<Spreads clubData={clubData} clubIndex={clubIndex} />
			</Card>
		</div>
	)
}
