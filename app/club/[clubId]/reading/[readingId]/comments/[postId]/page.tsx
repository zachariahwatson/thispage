"use client"

import { Post } from "@/components/ui/post"
import { createClient } from "@/utils/supabase/server"
import { User } from "@supabase/supabase-js"
import { Metadata } from "next"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

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
	const router = useRouter()
	const supabase = createClient()
	const [user, setUser] = useState<User>()

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (user) {
				setUser(user)
			} else {
				router.push(
					`/login?redirect=${defaultUrl}/club/${params.clubId}/reading/${params.readingId}/comments/${params.postId}`
				)
			}
		}
		fetchUser()
	}, [supabase])

	return <Post clubId={params.clubId} readingId={params.readingId} postId={params.postId} />
}
