"use client"

import { Badge, Separator, Skeleton } from "@/components/ui"
import { useClubMembership, useReading } from "@/contexts"
import { useLikes } from "@/hooks/state"
import { Like } from "@/lib/types"
import Link from "next/link"

interface Props {
	disabled?: boolean | false
	children: React.ReactNode
	likes: number
	comments: number
	id: number
}

export function ReadingPost({ disabled, children, likes, comments, id }: Props) {
	const clubMembership = useClubMembership()
	const readingData = useReading()
	const { data: userLikes } = useLikes({ memberId: String(clubMembership?.id) })
	// check if user has already liked the post or comment
	const hasLiked = userLikes?.find((like: Like) => like.post_id === Number(id) && id !== undefined)
	return (
		<>
			<Link
				href={`club/${clubMembership?.club.id}/reading/${readingData?.id}/comments/${id}`}
				className={disabled ? "text-muted-foreground pointer-events-none" : ""}
				aria-disabled={disabled}
				tabIndex={disabled ? -1 : undefined}
			>
				<div
					className={`flex flex-row relative items-center justify-between  ${
						!disabled ? "hover:font-medium transition-all" : ""
					}`}
				>
					<p className={`min-h-5 text-xs md:text-sm truncate ...`} title={`${children}`}>
						{children}
					</p>
					<div className="flex flex-row space-x-1">
						{comments > 0 && (
							<Badge variant="outline" className="px-1 md:px-2.5 ml-2 pointer-events-none">
								<span className="mr-1">{comments}</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
									/>
								</svg>
							</Badge>
						)}

						<Badge variant={hasLiked ? "default" : "outline"} className="px-1 md:px-2.5 pointer-events-none">
							<span className="mr-1">{likes}</span>👍
						</Badge>
					</div>
				</div>
			</Link>

			<Separator className="my-2" />
		</>
	)
}

export function ReadingPostSkeleton() {
	return (
		<>
			<div className="flex flex-row">
				<Skeleton className="w-2/3 h-[22px]" />
				<Skeleton className="w-[50px] h-[22px] shrink-0 ml-auto" />
			</div>
			<Separator className="my-2" />
		</>
	)
}
