"use client"
import { Input, RadioGroup } from "@/components/ui"
import { BookSearchList } from "@/components/ui/books/club/spreads/dashboard"
import { Button } from "@/components/ui/buttons"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { useRef, useState } from "react"
import { ControllerRenderProps } from "react-hook-form"

interface Props {
	field: ControllerRenderProps<
		(
			| {
					incrementType?: "pages" | undefined
					intervalPageLength: string
			  }
			| {
					incrementType: "sections"
					bookSections: string
					intervalSectionLength: string
					sectionName?: string | undefined
			  }
		) & {
			book: string
			startDate: string
			joinInProgress: boolean
			bookCoverImageURL?: string | undefined
		},
		"book"
	>
}

export function BookSearch({ field }: Props) {
	const [search, setSearch] = useState<string>("")
	const input = useRef<HTMLInputElement | null>(null)
	const button = useRef<HTMLButtonElement | null>(null)
	const radioGroup = useRef<HTMLDivElement | null>(null)

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault()
			setSearch(input.current?.value || "")
		}
	}

	return (
		<FormItem>
			<FormLabel>book</FormLabel>
			<div className="flex w-full items-center space-x-2">
				<Input ref={input} placeholder="search books" onKeyDown={handleKeyPress} />
				<Button type="button" variant="secondary" onClick={() => setSearch(input.current?.value || "")}>
					search
				</Button>
			</div>
			<FormControl>
				<RadioGroup onValueChange={field.onChange} defaultValue={""} className="flex flex-col space-y-1">
					<BookSearchList search={search} radioRef={radioGroup} />
				</RadioGroup>
			</FormControl>
			<FormMessage />
		</FormItem>
	)
}
