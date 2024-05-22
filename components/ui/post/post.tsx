"use client"

import { PostType } from "@/utils/types"
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Separator,
	Textarea,
} from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { useQuery } from "react-query"
import Image from "next/image"
import Link from "next/link"

interface Props {
	clubId: string
	readingId: string
	postId: string
}

export function Post({ clubId, readingId, postId }: Props) {
	//fetch other members' intervals
	const fetchPost = async () => {
		const url = new URL(`http://127.0.0.1:3000/api/clubs/${clubId}/readings/${readingId}/posts/${postId}`)
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

	const { data: post, isLoading: loading } = useQuery<PostType>(["post", clubId, readingId, postId], () => fetchPost())

	const createdAt = post && new Date(post?.createdAt)

	return (
		!loading &&
		post && (
			<div className="flex flex-row justify-center w-full space-x-2">
				<div className="max-w-2xl w-full space-y-4">
					<div className="space-y-2">
						<div className="flex flex-row items-center relative">
							<Button className="absolute top-0 -left-16 rounded-full hidden lg:block" variant="ghost">
								<Link href={`/#club-${clubId}-wrapper`}>
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
								<Avatar>
									<AvatarImage src={post.member.profile.avatarUrl} />
									<AvatarFallback>
										{post.member.profile.firstName && post.member.profile.lastName
											? post.member.profile.firstName[0] + post.member.profile.lastName[0]
											: post.member.profile.name.split(" ")[0] + post.member.profile.name.split(" ")[1]}
									</AvatarFallback>
								</Avatar>
							</div>
							<div className="flex flex-col">
								<p>
									{post.member.profile.name} •{" "}
									<span className="text-sm">
										{createdAt?.toLocaleDateString(undefined, {
											weekday: "long",
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</span>
								</p>
								<p className="text-muted-foreground italic">in {post.reading.club.name}</p>
							</div>
						</div>
						<h1 className="text-2xl font-bold">{post.title}</h1>
						<p>{post.content}</p>
						<Button className="p-0 bg-background hover:bg-background mr-2" variant="secondary">
							<Badge variant="secondary" className="">
								{post.likes} 👍
							</Badge>
						</Button>
					</div>
					<div className="pr-2">
						<Separator />
					</div>
					<div className="w-full space-y-2">
						<Textarea placeholder="type your comment here" />
						<Button className="w-1/4 float-right">comment</Button>
					</div>
				</div>
				<Card className="max-w-48 w-full rounded-lg hidden md:block sticky">
					<CardHeader className="p-4">
						<CardTitle className="text-md">{post.reading.book.title}</CardTitle>
						<CardDescription className="italic">
							by{" "}
							{post.reading.book.authors.map((author, i) => {
								if (i === post.reading.book.authors.length - 1) {
									return author
								} else if (i === post.reading.book.authors.length - 2) {
									return author + " and "
								} else {
									return author + ", "
								}
							})}
						</CardDescription>
					</CardHeader>
					<CardContent className="p-4 pt-2">
						<Image
							className="rounded-lg w-auto md:w-full md:max-h-full shadow-md"
							src={post.reading.book.imageUrl}
							width={post.reading.book.imageWidth}
							height={post.reading.book.imageHeight}
							alt={
								"Cover photo of " +
								post.reading.book.title +
								" by " +
								post.reading.book.authors.map((author, i) => {
									if (i === post.reading.book.authors.length - 1) {
										return author
									} else if (i === post.reading.book.authors.length - 2) {
										return author + " and "
									} else {
										return author + ", "
									}
								})
							}
						/>
					</CardContent>
				</Card>
			</div>
		)
	)
}
