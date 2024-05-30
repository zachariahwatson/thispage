"use client"

import { CommentType, SubCommentType } from "@/utils/types"
import { Button } from "@/components/ui/buttons"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage, Badge } from "@/components/ui"
import { useState } from "react"
import { ReplyTextArea } from "./reply-textarea"

interface Props {
	subCommentData: SubCommentType
}

export function SubComment({ subCommentData }: Props) {
	const [replyBoxVisible, setReplyBoxVisible] = useState<boolean>(false)
	return (
		<div id={`subcomment-${subCommentData.id}`} className="space-y-2">
			<div className="flex flex-row items-start">
				<div className="mr-4">
					<Avatar className="w-8 h-8 md:w-10 md:h-10">
						<AvatarImage src={subCommentData.member.profile.avatarUrl} />
						<AvatarFallback>
							{subCommentData.member.profile.firstName && subCommentData.member.profile.lastName
								? subCommentData.member.profile.firstName[0] + subCommentData.member.profile.lastName[0]
								: subCommentData.member.profile.name.split(" ")[0] + subCommentData.member.profile.name.split(" ")[1]}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="relative w-full">
					<div className="flex flex-col space-y-2 w-full">
						<p className="text-md">
							{subCommentData.member.profile.name} •{" "}
							<span className="text-sm">
								{new Date(subCommentData.createdAt).toLocaleDateString(undefined, {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</span>{" "}
							{subCommentData.parentComment && (
								<span className="text-muted-foreground text-sm">
									<Link href={`#subcomment-${subCommentData.parentComment.id}`}>
										▸{subCommentData.parentComment.member.profile.name}
									</Link>
								</span>
							)}
						</p>
						<p className="md:text-md text-sm w-full">{subCommentData.content}</p>
						<div className="flex flex-row">
							<Button className="p-0 bg-background hover:bg-background mr-2 justify-start" variant="secondary">
								<Badge variant="secondary" className="">
									{subCommentData.likes} 👍
								</Badge>
							</Button>
							<Button
								className="p-0 bg-background hover:bg-background mr-2 justify-start"
								variant="secondary"
								onClick={() => setReplyBoxVisible(!replyBoxVisible)}
							>
								<Badge variant="secondary" className="">
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
						</div>
						{replyBoxVisible && <ReplyTextArea setReplyBoxVisible={setReplyBoxVisible} />}
					</div>
				</div>
			</div>
		</div>
	)
}
