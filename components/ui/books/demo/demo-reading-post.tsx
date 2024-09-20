import { Badge, Separator, Skeleton } from "@/components/ui"
import Link from "next/link"

interface Props {
	disabled?: boolean | false
	children: React.ReactNode
	likes: number
	id: number
}

export function DemoReadingPost({ disabled, children, likes, id }: Props) {
	return (
		<>
			<Link
				href={`demo/${id}`}
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
					<div className="flex flex-row md:space-x-1">
						{id === 1 && (
							<Badge variant="outline" className="px-1 ml-2 pointer-events-none">
								<span className="min-w-3">2</span>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
									<path
										fillRule="evenodd"
										d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
										clipRule="evenodd"
									/>
								</svg>
							</Badge>
						)}

						<Badge variant={id === 1 ? "default" : "outline"} className="px-1 pointer-events-none">
							<span className="min-w-3">{likes}</span>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
								<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
							</svg>
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
