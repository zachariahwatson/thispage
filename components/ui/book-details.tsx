import { Separator, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui"
import { useMediaQuery } from "@/hooks"
import Image from "next/image"

interface Props {
	bookTitle?: string
	coverUrl?: string
	coverWidth?: number
	coverHeight?: number
	authors?: string[]
	description?: string
}

export function BookDetails({ bookTitle, coverUrl, coverWidth, coverHeight, authors, description }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")

	return (
		<SheetContent className={`max-w-xl md:max-w-xl space-y-4 ${isVertical && "w-full"} overflow-scroll`}>
			<SheetHeader className="text-left">
				<SheetTitle className="text-3xl">{bookTitle}</SheetTitle>
				<SheetDescription className="italic">
					{authors
						? " by " +
						  (authors.length === 2
								? authors.join(" and ")
								: authors
										.map((author: string, i: number) => {
											if (i === authors.length - 1 && authors.length !== 1) {
												return "and " + author
											} else {
												return author
											}
										})
										.join(", "))
						: null}
				</SheetDescription>
			</SheetHeader>
			<Separator />

			{coverUrl && coverWidth && coverWidth > 1 && coverHeight && coverHeight > 1 && (
				<Image
					src={coverUrl}
					width={coverWidth}
					height={coverHeight}
					alt={
						"Cover photo of " + bookTitle ||
						"Unknown" +
							(authors
								? " by " +
								  (authors.length === 2
										? authors.join(" and ")
										: authors
												.map((author: string, i: number) => {
													if (i === authors.length - 1 && authors.length !== 1) {
														return "and " + author
													} else {
														return author
													}
												})
												.join(", "))
								: null)
					}
					className="rounded-lg w-1/2 max-h-full shadow-shadow shadow-md object-contain float-left mr-4 mb-4"
				/>
			)}

			<SheetDescription className="italic">{description}</SheetDescription>
		</SheetContent>
	)
}
