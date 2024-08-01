"use client"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	PostComments,
	ScrollArea,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Skeleton,
	Textarea,
} from "@/components/ui"
import { Button, RootCommentButton } from "@/components/ui/buttons"
import { useQuery } from "react-query"
import Image from "next/image"
import Link from "next/link"
import type { ClubMembership, Post } from "@/lib/types"
import { useMediaQuery } from "@/hooks"
import { useSearchParams, redirect } from "next/navigation"
import { useClubs } from "@/hooks/state"
import { toast } from "sonner"
import { useEffect, useState } from "react"

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
	const { data: clubMemberships } = useClubs()
	const clubMembership = clubMemberships?.find((clubMembership) => String(clubMembership.club.id) === clubId)

	useEffect(() => {
		//check to make sure user is in club
		if (!clubMembership) {
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
									: post.member?.name && post.member?.name.split(" ")[0] + post.member?.name.split(" ")[1]}
							</AvatarFallback>
						</Avatar>
					</div>
					<div className="relative max-w-[calc(100%-56px)] w-full">
						<div className="flex flex-col pr-10">
							<p className="text-md">
								{post.member?.name} •{" "}
								<span className="text-sm">
									{createdAt?.toLocaleDateString(undefined, {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
							</p>
							<p className="text-muted-foreground italic truncate ... md:text-sm text-xs">
								{post.reading.book_title} • {post.reading.club.name}
							</p>
						</div>
						<div className="absolute right-0 top-0">
							{isVertical ? (
								<Drawer>
									<DrawerTrigger className="hover:ring-4 hover:ring-ring rounded transition-all">
										<Image
											className="rounded h-10 md:h-16 w-auto shadow-shadow shadow-md"
											src={post.reading.book_cover_image_url || ""}
											width={post.reading.book_cover_image_width || 0}
											height={post.reading.book_cover_image_height || 0}
											alt=""
										/>
									</DrawerTrigger>
									<DrawerContent className="space-y-4 p-6 max-h-screen h-full">
										<DrawerHeader className="text-left p-0">
											<DrawerTitle>{post.reading.book_title}</DrawerTitle>
											<DrawerDescription className="italic">
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
											</DrawerDescription>
										</DrawerHeader>
										<Image
											className="rounded-lg w-full max-w-48 shadow-shadow shadow-md"
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
										<DrawerDescription className="italic">{post.reading.book_description}</DrawerDescription>
									</DrawerContent>
								</Drawer>
							) : (
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
									<SheetContent className="space-y-4">
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
							)}
						</div>
					</div>
				</div>
				<h1 className="text-lg md:text-2xl font-bold">{post.title}</h1>
				<p className="md:text-md text-sm">{post.content}</p>
				<Button className="p-0 bg-background hover:bg-background mr-2" variant="secondary">
					<Badge variant="outline">{post.likes_count} 👍</Badge>
				</Button>
			</div>
			<div className="pr-2">
				<Separator />
			</div>
			<RootCommentButton clubId={clubId} readingId={readingId} postId={postId} memberId={memberId} />
			<PostComments clubId={clubId} readingId={readingId} postId={postId} memberId={memberId} />
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
