"use client"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	BookDetails,
	Separator,
	Sheet,
	SheetTrigger,
	Skeleton,
} from "@/components/ui"
import { Button, LikeButton, PostActionsButton, RootCommentButton } from "@/components/ui/buttons"
import { PostComments } from "@/components/ui/post"
import { useClubs, useUser } from "@/hooks/state"
import type { Post } from "@/lib/types"
import { QueryError } from "@/utils/errors"
import { createClient } from "@/utils/supabase/client"
import TimeAgo from "javascript-time-ago"
import Image from "next/image"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useQuery } from "react-query"
import { toast } from "sonner"

interface Props {
	clubId: string
	readingId: string
	postId: string
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

/**
 *
 * @todo do something about the member id being exposed, dont like that
 */
export function Post({ clubId, readingId, postId }: Props) {
	const { data: user, isLoading: userLoading } = useUser()
	const { data: clubMemberships, isLoading: clubsLoading } = useClubs()
	const clubMembership = clubMemberships?.find((clubMembership) => String(clubMembership.club.id) === clubId)
	const router = useRouter()
	const supabase = createClient()

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (!user) {
				router.push(`/login?redirect=${defaultUrl}/club/${clubId}/reading/${readingId}/comments/${postId}`)
			}
		}
		fetchUser()
	}, [supabase])

	useEffect(() => {
		if (clubMemberships && !clubMembership) {
			toast.error("oops! you don't have access to that page.")
			redirect("/")
		}
	}, [clubMemberships, clubMembership])

	const memberId = String(clubMembership?.id)
	//fetch post
	const fetchPost = async () => {
		const url = new URL(`${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}`)
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			const body = await response.json()
			throw new QueryError(body.message, body.code)
		}

		return await response.json()
	}

	const {
		data: post,
		isLoading: loading,
		error,
		refetch,
	} = useQuery<Post>(["post", clubId, readingId, postId], () => fetchPost())

	const createdAt = post && new Date(post.created_at)

	const timeAgo = new TimeAgo("en-US")

	return (
		<div className="flex flex-col items-center max-w-5xl w-full space-y-4 px-2 md:px-12 pb-12 bg-page rounded-b-3xl shadow-md shadow-shadow -mt-6 border border-border">
			<div className="absolute top-[73px] bg-page max-w-5xl w-[calc(100%-1rem)] h-12 border-x border-border" />
			{!error ? (
				!loading && post && user && !userLoading ? (
					<div className="flex flex-col justify-center max-w-4xl w-full space-y-4">
						<div className="space-y-2">
							<div className="flex flex-row items-center relative">
								<Button className="absolute top-0 -left-[3.75rem] rounded-full hidden lg:block" variant="ghost">
									<Link href={`/#club-${clubId}`}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
										</svg>
									</Link>
								</Button>
								<div className="mr-4">
									<Avatar className="w-8 h-8 md:w-10 md:h-10">
										<AvatarImage src={post.member?.avatar_url || ""} />
										<AvatarFallback>
											{post.member?.first_name && post.member?.last_name
												? post.member?.first_name[0] + post.member?.last_name[0]
												: post.member?.name && post.member?.name.split(" ")[0][0] + post.member?.name.split(" ")[1][0]}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className="relative max-w-[calc(100%-56px)] w-full">
									<div className="flex flex-col pr-10">
										<p className="text-md">
											{post.member?.name} •{" "}
											<span className="text-sm" title={createdAt?.toUTCString()}>
												{timeAgo.format(createdAt ?? new Date())}
											</span>
										</p>
										<p className="text-muted-foreground italic truncate ... md:text-sm text-xs">
											{post.reading.book_title} • {post.reading.club.name}
										</p>
									</div>
									<div className="absolute right-0 top-8">
										<Sheet>
											<SheetTrigger className="hover:ring-4 hover:ring-ring rounded transition-all">
												<Image
													className="rounded h-10 md:h-16 w-auto shadow-shadow shadow-md"
													src={post.reading.book_cover_image_url || ""}
													width={post.reading.book_cover_image_width || 0}
													height={post.reading.book_cover_image_height || 0}
													alt=""
												/>
											</SheetTrigger>
											<BookDetails
												bookTitle={post.reading.book_title}
												coverUrl={post.reading.book_cover_image_url || ""}
												coverWidth={post.reading.book_cover_image_width || 0}
												coverHeight={post.reading.book_cover_image_height || 0}
												authors={post.reading.book_authors ?? undefined}
												description={post.reading.book_description ?? undefined}
											/>
										</Sheet>
									</div>

									{clubMembership &&
										(clubMembership.role !== "member" || (!userLoading && user.id === post.member?.id)) && (
											<PostActionsButton post={post} clubMembership={clubMembership} />
										)}
								</div>
							</div>
							<h1 className="text-lg md:text-2xl font-bold break-words pr-16 font-epilogue">{post.title}</h1>
							<pre className="md:text-md text-sm break-words whitespace-pre-wrap font-plus-jakarta-sans">
								{post.content}
							</pre>

							<LikeButton
								likesCount={post.likes_count}
								clubId={clubId}
								readingId={readingId}
								postId={postId}
								memberId={String(clubMembership?.id)}
								likes={post.likes}
							/>
						</div>
						<div className="pr-2">
							<Separator />
						</div>
						<RootCommentButton clubId={clubId} readingId={readingId} postId={postId} memberId={memberId} />
						{/* <div className="pr-2">
							<Separator />
						</div> */}
						{clubMembership && (
							<PostComments
								clubId={clubId}
								readingId={readingId}
								postId={postId}
								memberId={memberId}
								clubMembership={clubMembership}
							/>
						)}
					</div>
				) : (
					<PostSkeleton />
				)
			) : (
				<div className="p-3 md:p-4 flex flex-col justify-center items-center h-full text-destructive space-y-2">
					<div className="flex flex-row justify-center items-center w-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-16 mr-2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
							/>
						</svg>
						<div>
							<p>{(error as QueryError).message}</p>
							<p className="text-muted-foreground">{(error as QueryError).code}</p>
						</div>
					</div>
					<Button
						variant="accent"
						onClick={(e) => {
							e.preventDefault()
							refetch()
						}}
					>
						retry
					</Button>
				</div>
			)}
		</div>
	)
}

export function PostSkeleton() {
	return (
		<div className="flex flex-col justify-center max-w-4xl w-full space-y-4">
			<div className="space-y-2">
				<div className="flex flex-row items-center relative">
					<div className="mr-4">
						<Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
					</div>
					<div className="relative max-w-[calc(100%-56px)] w-full">
						<div className="flex flex-col pr-10 space-y-1">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-5 w-56" />
						</div>
						<div className="absolute right-0 top-0">
							<Skeleton className="rounded h-10 md:h-16 w-7 md:w-12 shadow-shadow shadow-md" />
						</div>
					</div>
				</div>
				<Skeleton className="h-6 md:h-8 w-3/4" />
				<Skeleton className="h-6 w-80 md:w-96" />
				<Skeleton className="rounded-lg h-5 w-12" />
			</div>
			<div className="pr-2">
				<Separator />
			</div>
		</div>
	)
}
