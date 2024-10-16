import { Separator, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui"
import { useMediaQuery } from "@/hooks"
import Image from "next/image"
import { useSwipeable } from "react-swipeable"

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
				<SheetTitle className="text-3xl pr-4">{bookTitle}</SheetTitle>
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
			<SheetDescription className="italic">{description}</SheetDescription>

			{coverUrl && coverWidth && coverWidth > 1 && coverHeight && coverHeight > 1 && (
				<Image
					src={coverUrl}
					width={coverWidth}
					height={coverHeight}
					alt=""
					className="rounded-lg w-full max-h-full shadow-shadow shadow-md object-contain md:mr-4 md:mb-4"
				/>
			)}
		</SheetContent>
	)
}
