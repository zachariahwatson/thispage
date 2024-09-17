import { Post } from "@/components/ui/post"
import { Metadata } from "next"

interface Props {
	params: {
		clubId: string
		readingId: string
		postId: string
	}
}

export const metadata: Metadata = {
	title: "a post | thispage",
	description: "join the discussion",
	openGraph: {
		title: "a post | thispage",
		description: "join the discussion",
	},
}

export default async function Page({ params }: Props) {
	return <Post clubId={params.clubId} readingId={params.readingId} postId={params.postId} />
}
