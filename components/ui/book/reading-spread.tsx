import { ReadingType } from "@/utils/types"
import { Card } from "@/components/ui"

interface Props {
	readingData: ReadingType
	clubIndex: number
}

export async function ReadingSpread({ readingData, clubIndex }: Props) {
	// const readingPosts = (await getReadingPosts({ readingId: readingData.id })) as PostType[]
	// const readingMemberIntervals = (await getReadingMemberIntervals({ readingId: readingData.id })) as IntervalType[]

	return <Card id={`club-${clubIndex}-spread`} className="h-full" />
}
