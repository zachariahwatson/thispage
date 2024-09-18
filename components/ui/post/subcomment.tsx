"use client"

import { Avatar, AvatarFallback, AvatarImage, Badge } from "@/components/ui"
import { Button, CommentActionsButton, LikeButton, SubCommentButton } from "@/components/ui/buttons"
import { useUser } from "@/hooks/state"
import type { ClubMembership, Comment as CommentType } from "@/lib/types"
import Link from "next/link"
import { useState } from "react"

interface Props {
	subCommentData: CommentType["comments"][number]
	rootCommentId: number
	clubId: string
	readingId: string
	postId: string
	memberId: string
	clubMembership: ClubMembership
}

export function SubComment({
	subCommentData,
	rootCommentId,
	clubId,
	readingId,
	postId,
	memberId,
	clubMembership,
}: Props) {
	const [replyBoxVisible, setReplyBoxVisible] = useState<boolean>(false)
	const { data: user, isLoading: loading } = useUser()
	return (
		<div id={`subcomment-${subCommentData.id}`} className="space-y-2">
			<div className="flex flex-row items-start">
				<div className="mr-4">
					<Avatar className="w-8 h-8 md:w-10 md:h-10">
						<AvatarImage src={subCommentData.member?.avatar_url || ""} />
						<AvatarFallback>
							{subCommentData.member?.first_name && subCommentData.member?.last_name
								? subCommentData.member?.first_name[0] + subCommentData.member?.last_name[0]
								: subCommentData.member?.name &&
								  subCommentData.member?.name.split(" ")[0][0] + subCommentData.member?.name.split(" ")[1][0]}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="relative w-full">
					<div className="flex flex-col space-y-2 w-full">
						<p className="text-md">
							{subCommentData.member?.name || "[deleted]"} •{" "}
							<span className="text-sm">
								{new Date(subCommentData.created_at)
									.toLocaleDateString(undefined, {
										year: "numeric",
										month: "long",
										day: "numeric",
									})
									.toLowerCase()}
							</span>{" "}
							{subCommentData.replying_to && (
								<span className="text-muted-foreground text-sm">
									<Link href={`#subcomment-${subCommentData.replying_to.id}`}>
										▸{subCommentData.replying_to.member?.name || "[deleted]"}
									</Link>
								</span>
							)}
						</p>
						<p className="md:text-md text-sm w-full break-words">{subCommentData.content}</p>
						<div className="flex flex-row items-center">
							<LikeButton
								likesCount={subCommentData.likes_count}
								clubId={clubId}
								readingId={readingId}
								postId={postId}
								commentId={String(subCommentData.id)}
								memberId={String(clubMembership?.id)}
							/>
							<Button
								className="p-0 bg-background hover:bg-background mr-2 justify-start"
								variant="accent"
								onClick={() => setReplyBoxVisible(!replyBoxVisible)}
							>
								<Badge variant="outline" className="">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-4 mr-1"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
										/>
									</svg>{" "}
									reply
								</Badge>
							</Button>
							{clubMembership &&
								(clubMembership.role !== "member" || (!loading && user.id === subCommentData.member?.id)) && (
									<CommentActionsButton
										commentData={subCommentData}
										clubId={clubId}
										readingId={readingId}
										postId={postId}
										clubMembership={clubMembership}
									/>
								)}
						</div>
						{replyBoxVisible && (
							<SubCommentButton
								setReplyBoxVisible={setReplyBoxVisible}
								rootCommentId={rootCommentId}
								subCommentData={subCommentData}
								clubId={clubId}
								readingId={readingId}
								postId={postId}
								memberId={memberId}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
