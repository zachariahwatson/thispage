"use client"

import { Avatar, AvatarFallback, AvatarImage, Badge, Skeleton } from "@/components/ui"
import { Button, CommentActionsButton, CommentButton, LikeButton } from "@/components/ui/buttons"
import { SubComment } from "@/components/ui/post"
import { useUser } from "@/hooks/state"
import type { ClubMembership, Comment as CommentType } from "@/lib/types"
import TimeAgo from "javascript-time-ago"
import { useState } from "react"

interface Props {
	commentData: CommentType
	clubId: string
	readingId: string
	postId: string
	memberId: string
	clubMembership: ClubMembership
}

export function Comment({ commentData, clubId, readingId, postId, memberId, clubMembership }: Props) {
	const [repliesVisible, setRepliesVisible] = useState<boolean>(false)
	const [replyBoxVisible, setReplyBoxVisible] = useState<boolean>(false)
	const { data: user, isLoading: loading } = useUser()
	const timeAgo = new TimeAgo("en-US")
	return (
		<div className="space-y-2">
			<div className="flex flex-row items-start">
				<div className="mr-4">
					<Avatar className="w-8 h-8 md:w-10 md:h-10">
						<AvatarImage src={commentData.member?.avatar_url || ""} />
						<AvatarFallback>
							{commentData.member?.first_name && commentData.member?.last_name
								? commentData.member?.first_name[0] + commentData.member?.last_name[0]
								: commentData.member?.name &&
								  commentData.member?.name.split(" ")[0][0] + commentData.member?.name.split(" ")[1][0]}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="relative w-full space-y-2">
					<div className="flex flex-col space-y-2 w-full">
						<p className="text-md">
							{commentData.member?.name || "[deleted]"} •{" "}
							<span className="text-sm" title={new Date(commentData.created_at).toUTCString()}>
								{timeAgo.format(new Date(commentData.created_at))}
							</span>
						</p>

						<pre className="md:text-md text-sm w-full break-words whitespace-pre-wrap font-plus-jakarta-sans">
							{commentData.content}
						</pre>

						<div className="flex flex-row items-center w-full">
							{/* <Button className="p-0 bg-background hover:bg-background mr-2 justify-start" variant="accent">
								<Badge variant="outline" className="">
									{commentData.likes_count} 👍
								</Badge>
							</Button> */}
							<LikeButton
								likesCount={commentData.likes_count}
								clubId={clubId}
								readingId={readingId}
								postId={postId}
								commentId={String(commentData.id)}
								memberId={String(clubMembership?.id)}
								likes={commentData.likes}
							/>
							<button className="mr-2" onClick={() => setReplyBoxVisible(!replyBoxVisible)}>
								<Badge variant="outline">
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
							</button>
							{clubMembership &&
								(clubMembership.role !== "member" || (!loading && user.id === commentData.member?.id)) && (
									<CommentActionsButton
										commentData={commentData}
										clubId={clubId}
										readingId={readingId}
										postId={postId}
										clubMembership={clubMembership}
									/>
								)}
						</div>
						{replyBoxVisible && (
							<CommentButton
								setReplyBoxVisible={setReplyBoxVisible}
								setRepliesVisible={setRepliesVisible}
								commentData={commentData}
								clubId={clubId}
								readingId={readingId}
								postId={postId}
								memberId={memberId}
							/>
						)}
					</div>
					{repliesVisible ? (
						<>
							{commentData.comments.map((subComment) => (
								<SubComment
									key={subComment.id}
									subCommentData={subComment}
									rootCommentId={commentData.id}
									clubId={clubId}
									readingId={readingId}
									postId={postId}
									memberId={memberId}
									clubMembership={clubMembership}
								/>
							))}
							<Button variant="link" onClick={() => setRepliesVisible(false)} className="text-muted-foreground">
								hide
							</Button>
						</>
					) : (
						commentData.comments.length !== 0 && (
							<Button variant="link" onClick={() => setRepliesVisible(true)} className="text-muted-foreground">
								view {commentData.comments.length} {commentData.comments.length === 1 ? "reply" : "replies"}
							</Button>
						)
					)}
				</div>
			</div>
		</div>
	)
}

export function CommentSkeleton() {
	return (
		<div className="space-y-2">
			<div className="flex flex-row items-start">
				<div className="mr-4">
					<Skeleton className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
				</div>
				<div className="relative">
					<div className="flex flex-col pr-10 space-y-2">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-12 md:h-6 w-64 md:w-96" />
						<div className="flex flex-row">
							<Skeleton className="rounded-lg h-5 w-12 mr-2" />
							<Skeleton className="rounded-lg h-5 w-[72px]" />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
