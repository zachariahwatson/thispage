"use client"

import { PageRight } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
}

export function EmptyPageRight({ userSpreadIndex }: Props) {
	return (
		<PageRight userSpreadIndex={userSpreadIndex}>
			<div className="p-4 flex justify-center items-center w-full h-full">
				<p className="text-muted-foreground">🦗*crickets*🦗</p>
			</div>
		</PageRight>
	)
}
