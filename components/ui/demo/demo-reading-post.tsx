import { Badge, Separator, Skeleton } from "@/components/ui"
import { useClubMembership, useReading } from "@/contexts"
import Link from "next/link"

interface Props {
	disabled?: boolean | false
	children: React.ReactNode
	likes: number
}

export function DemoReadingPost({ disabled, children, likes }: Props) {
	return (
		<>
			<div className="flex flex-row pr-10 md:pr-14 relative">
				<p
					className={`min-h-5 text-xs md:text-sm truncate ... ${
						!disabled ? "hover:font-medium transition-all cursor-pointer" : "text-muted-foreground"
					}`}
				>
					{children}
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
