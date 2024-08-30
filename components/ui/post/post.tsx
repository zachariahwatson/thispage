"use client"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Skeleton,
} from "@/components/ui"
import { Button, LikeButton, PostActionsButton, RootCommentButton } from "@/components/ui/buttons"
import { PostComments } from "@/components/ui/post"
import { useMediaQuery } from "@/hooks"
import { useClubs, useUser } from "@/hooks/state"
import type { Post } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ProbeResult } from "probe-image-size"
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
	const { data: clubMemberships, isLoading: clubsLoading } = useClubs()
	const clubMembership = clubMemberships?.find((clubMembership) => String(clubMembership.club.id) === clubId)
	const { data: user, isLoading: userLoading } = useUser()

	useEffect(() => {
		if (!clubMembership && !clubsLoading) {
			toast.error("oops! you don't have access to that page.")
			redirect("/")
		}
	}, [])

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
			throw new Error(body.error)
		}

		return await response.json()
	}

	const { data: post, isLoading: loading } = useQuery<Post>(["post", clubId, readingId, postId], () => fetchPost())

	const createdAt = post && new Date(post.created_at)

	const isVertical = useMediaQuery("(max-width: 768px)")

	const { data: coverImage } = useQuery<ProbeResult>({
		queryKey: ["cover image", readingId],
		queryFn: async () => {
			const url = new URL(`${defaultUrl}/api/images?url=${post?.reading.book_cover_image_url}`)
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
		},
	})

	return !loading && post ? (
		<div className="flex flex-col justify-center max-w-4xl w-full space-y-4">
			<div className="space-y-2">
				<div className="flex flex-row items-center relative">
					<Button className="absolute top-0 -left-16 rounded-full hidden lg:block" variant="ghost">
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
								<span className="text-sm">
									{createdAt
										?.toLocaleDateString(undefined, {
											year: "numeric",
											month: "long",
											day: "numeric",
										})
										.toLowerCase()}
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
										alt={
											"Cover photo of " +
											post.reading.book_title +
											" by " +
											(post.reading.book_authors?.length === 2
												? post.reading.book_authors.join(" and ")
												: post.reading.book_authors
														?.map((author: string, i: number) => {
															if (
																i === (post.reading.book_authors ? post.reading.book_authors.length - 1 : 0) &&
																post.reading.book_authors?.length !== 1
															) {
																return "and " + author
															} else {
																return author
															}
														})
														.join(", "))
										}
									/>
								</SheetTrigger>
								<SheetContent className={`max-w-xl space-y-4 ${isVertical && "w-full"} overflow-scroll`}>
									<SheetHeader className="text-left">
										<SheetTitle>{post.reading.book_title}</SheetTitle>
										<SheetDescription className="italic">
											by{" "}
											{post.reading.book_authors?.length === 2
												? post.reading.book_authors.join(" and ")
												: post.reading.book_authors
														?.map((author: string, i: number) => {
															if (
																i === (post.reading.book_authors ? post.reading.book_authors.length - 1 : 0) &&
																post.reading.book_authors?.length !== 1
															) {
																return "and " + author
															} else {
																return author
															}
														})
														.join(", ")}
										</SheetDescription>
									</SheetHeader>
									<Image
										className="rounded-lg w-full max-h-full shadow-shadow shadow-md"
										src={post.reading.book_cover_image_url || ""}
										width={post.reading.book_cover_image_width || 0}
										height={post.reading.book_cover_image_height || 0}
										alt={
											"Cover photo of " +
											post.reading.book_title +
											" by " +
											(post.reading.book_authors?.length === 2
												? post.reading.book_authors.join(" and ")
												: post.reading.book_authors
														?.map((author: string, i: number) => {
															if (
																i === (post.reading.book_authors ? post.reading.book_authors.length - 1 : 0) &&
																post.reading.book_authors?.length !== 1
															) {
																return "and " + author
															} else {
																return author
															}
														})
														.join(", "))
										}
									/>
									<SheetDescription className="italic">{post.reading.book_description}</SheetDescription>
								</SheetContent>
							</Sheet>
						</div>

						{clubMembership && (clubMembership.role !== "member" || (!userLoading && user.id === post.member?.id)) && (
							<PostActionsButton post={post} clubMembership={clubMembership} />
						)}
					</div>
				</div>
				<h1 className="text-lg md:text-2xl font-bold break-words">{post.title}</h1>
				<p className="md:text-md text-sm break-words">{post.content}</p>
				<LikeButton
					likesCount={post.likes_count}
					clubId={clubId}
					readingId={readingId}
					postId={postId}
					memberId={String(clubMembership?.id)}
				/>
			</div>
			<div className="pr-2">
				<Separator />
			</div>
			<RootCommentButton clubId={clubId} readingId={readingId} postId={postId} memberId={memberId} />
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
				<Skeleton className="h-6 md:h-8 w-64" />
				<Skeleton className="h-6 w-80 md:w-96" />
				<Button className="p-0 bg-background hover:bg-background mr-2 justify-start" variant="secondary">
					<Skeleton className="rounded-lg h-5 w-12" />
				</Button>
			</div>
			<div className="pr-2">
				<Separator />
			</div>
		</div>
	)
}
