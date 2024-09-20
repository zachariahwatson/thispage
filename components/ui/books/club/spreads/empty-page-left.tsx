"use client"

import { PageLeft } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
}

export function EmptyPageLeft({ userSpreadIndex }: Props) {
	return (
		<PageLeft userSpreadIndex={userSpreadIndex}>
			<div className="p-4 flex justify-center items-center w-full h-full">
				<p className="text-muted-foreground">hmm... no pages... a lil empty in here...</p>
			</div>
		</PageLeft>
	)
}
