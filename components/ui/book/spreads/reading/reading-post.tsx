import { Badge, Separator, Skeleton } from "@/components/ui"
import Link from "next/link"

interface Props {
	disabled?: boolean | false
	memberId: number
	clubId: number | null
	readingId: number | null
	children: React.ReactNode
	likes: number
	id: number
}

export function ReadingPost({ disabled, memberId, clubId, readingId, children, likes, id }: Props) {
	return (
		<>
			<div className="flex flex-row pr-10 md:pr-14 relative">
				<p className={`min-h-5 text-xs md:text-sm truncate ... ${!disabled ? "hover:font-medium transition-all" : ""}`}>
					<Link
						href={`club/${clubId}/reading/${readingId}/comments/${id}?memberId=${memberId}`}
						className={disabled ? "text-muted-foreground pointer-events-none" : ""}
						aria-disabled={disabled}
						tabIndex={disabled ? -1 : undefined}
					>
						{children}
					</Link>
				</p>

				<Badge variant="outline" className="absolute self-center right-0 px-1 md:px-2.5">
					{likes} 👍
				</Badge>
			</div>

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
