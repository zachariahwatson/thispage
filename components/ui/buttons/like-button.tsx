"use client"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator,
} from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { useLikes } from "@/hooks/state"
import { Like, Post } from "@/lib/types"
import { QueryError } from "@/utils/errors"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

interface Props {
	likesCount: number
	clubId: string
	readingId: string
	postId?: string
	commentId?: string
	memberId: string
	likes: Post["likes"]
}

export function LikeButton({ likesCount, clubId, readingId, postId, commentId, memberId, likes }: Props) {
	const { data: userLikes } = useLikes({ memberId })

	// check if user has already liked the post or comment
	const hasLiked = userLikes?.find((like: Like) =>
		commentId ? like.comment_id === Number(commentId) : like.post_id === Number(postId)
	)

	const queryClient = useQueryClient()
	const mutation = useMutation({
		mutationFn: async (newLike: { member_id: number }) => {
			const url = new URL(
				hasLiked
					? commentId
						? `${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/comments/${commentId}/likes/${hasLiked.id}`
						: `${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/likes/${hasLiked.id}`
					: commentId
					? `${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/comments/${commentId}/likes`
					: `${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/likes`
			)
			if (hasLiked) {
				const response = await fetch(url, {
					method: "DELETE",
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
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newLike),
			})
			if (!response.ok) {
				const body = await response.json()
				throw new QueryError(body.message, body.code)
			}

			return await response.json()
		},
		onError: (error: any) => {
			toast.error(error.message, { description: error.code })
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["post", clubId, readingId, postId])
			queryClient.invalidateQueries(["comments", clubId, readingId, postId])
			queryClient.invalidateQueries(["likes", memberId])
			queryClient.invalidateQueries(["posts", Number(clubId), Number(readingId)])
		},
	})

	return (
		<div className="flex flex-row items-center space-x-1 mr-2">
			<button onClick={() => mutation.mutate({ member_id: Number(memberId) })}>
				<Badge variant={hasLiked ? "default" : "outline"} className="px-2">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
						<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
					</svg>
				</Badge>
			</button>
			{mutation.isLoading ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-3 animate-spin"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
					/>
				</svg>
			) : (
				<Popover>
					<PopoverTrigger>
						<p className={`min-w-3 text-center ${likes && likes.length > 0 ? "hover:underline" : "cursor-default"}`}>
							{Intl.NumberFormat("en-US", {
								notation: "compact",
								maximumFractionDigits: 1,
							}).format(likesCount)}
						</p>
					</PopoverTrigger>
					{likes && likes.length > 0 && (
						<PopoverContent className="w-48 h-56 md:w-56 md:h-64 m-2 overflow-y-scroll">
							<h1 className="font-bold">likes</h1>
							<Separator className="mb-2 mt-1" />
							<div className="w-full h-auto space-y-2">
								{likes.map((like) => (
									<div className="flex flex-row items-center space-x-1 text-sm w-full">
										<Avatar className="size-5 mr-1">
											<AvatarImage src={like.avatar_url || ""} />
											<AvatarFallback>
												{like.first_name && like.last_name
													? like.first_name[0] + like.last_name[0]
													: like.name && like.name?.split(" ")[0][0] + like.name?.split(" ")[1][0]}
											</AvatarFallback>
										</Avatar>
										<p
											className="truncate ... text-nowrap"
											title={
												(like.first_name && like.last_name ? like.first_name + " " + like.last_name : like.name) ?? ""
											}
										>
											{like.first_name && like.last_name ? like.first_name + " " + like.last_name : like.name}
										</p>
									</div>
								))}
							</div>
						</PopoverContent>
					)}
				</Popover>
			)}
		</div>
	)
}
