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
	id: number
}

export function ReadingPost({ disabled, children, likes, id }: Props) {
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
					<Badge variant={hasLiked ? "default" : "outline"} className="px-1 md:px-2.5 cursor-default ml-2">
						<span className="mr-1">{likes}</span>👍
					</Badge>
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
