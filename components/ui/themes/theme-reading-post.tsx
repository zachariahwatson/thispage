import { Badge, Separator, Skeleton } from "@/components/ui"
import Link from "next/link"

interface Props {
	disabled?: boolean | false
	children: React.ReactNode
	likes: number
	id: number
}

export function ThemeReadingPost({ disabled, children, likes, id }: Props) {
	return (
		<>
			<div className="flex flex-row relative items-center justify-between">
				<p
					className={`min-h-5 text-xs md:text-sm truncate ... ${
						!disabled ? "hover:font-medium transition-all cursor-pointer" : "text-muted-foreground"
					}`}
				>
					<Link
						href={`demo/${id}`}
						className={disabled ? "text-muted-foreground pointer-events-none" : ""}
						aria-disabled={disabled}
						tabIndex={disabled ? -1 : undefined}
					>
						{children}
					</Link>
				</p>

				<Badge variant="outline" className="px-1 md:px-2.5">
					<span className="mr-1">{likes}</span>👍
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
