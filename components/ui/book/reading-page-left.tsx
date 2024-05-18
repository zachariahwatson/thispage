"use client"

import { ReadingType } from "@/utils/types"
import { useState } from "react"

interface Props {
	data: ReadingType
}

export function ReadingPageLeft({ data }: Props) {
	const [readingData, setReadingData] = useState(data)

	// useEffect(() => {
	// 	const getPosts = async () => {
	// 		setPosts((await getReadingPosts({ readingId: readingData.id })) as PostType[])
	// 	}
	// 	getPosts().catch(console.error)

	// 	const getMemberIntervals = async () => {
	// 		setMemberIntervals((await getReadingMemberIntervals({ readingId: readingData.id })) as IntervalType[])
	// 	}
	// 	getMemberIntervals().catch(console.error)
	// }, [])

	return <div id="spread" className="p-3"></div>
}
