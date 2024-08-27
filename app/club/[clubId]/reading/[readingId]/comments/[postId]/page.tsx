import { Post } from "@/components/ui/post"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

interface Props {
	params: {
		clubId: string
		readingId: string
		postId: string
	}
}

export const metadata = {
	title: "a post | thispage",
	description: "join the discussion",
	openGraph: {
		title: "a post | thispage",
		description: "join the discussion",
	},
}

export default async function Page({ params }: Props) {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return redirect("/login")
	}

	return <Post clubId={params.clubId} readingId={params.readingId} postId={params.postId} />
}
