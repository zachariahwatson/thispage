"use server"

import { Post } from "@/components/ui/post"
import { Database } from "@/lib/types"
import { Metadata } from "next"

interface Props {
	params: {
		clubId: string
		readingId: string
		postId: string
	}
}

// export const metadata: Metadata = {
// 	title: "a post | thispage",
// 	description: "join the discussion",
// 	openGraph: {
// 		title: "a post | thispage",
// 		description: "join the discussion",
// 	},
// }

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

type PostType = Database["public"]["Views"]["post_metadata_view"]["Row"]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	//fetch post
	const fetchPost = async () => {
		const url = new URL(
			`${defaultUrl}/api/clubs/${params.clubId}/readings/${params.readingId}/posts/${params.postId}/metadata`
		)
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			const body = await response.json()
			throw new Error(body.error)
		}

		return await response.json()
	}

	// fetch data
	const post: PostType = await fetchPost()

	const imageAlt =
		"Cover photo of " +
		post.book_title +
		" by " +
		(post.book_authors?.length === 2
			? post.book_authors.join(" and ")
			: post.book_authors
					?.map((author: string, i: number) => {
						if (i === (post.book_authors ? post.book_authors.length - 1 : 0) && post.book_authors?.length !== 1) {
							return "and " + author
						} else {
							return author
						}
					})
					.join(", "))

	return {
		title: `${post.post_title} | ${post.book_title} in ${post.club_name} | thispage`,
		description: "join the discussion",
		openGraph: {
			title: `${post.post_title} | ${post.book_title} in ${post.club_name} | thispage`,
			description: "join the discussion",
			images: [
				{
					url: post.book_cover_image_url || "", // Must be an absolute URL
					width: post.book_cover_image_width || 0,
					height: post.book_cover_image_height || 0,
					alt: imageAlt,
				},
			],
		},
	}
}

export default async function Page({ params }: Props) {
	return <Post clubId={params.clubId} readingId={params.readingId} postId={params.postId} />
}
