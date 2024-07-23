"use client"
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	RadioGroup,
	RadioGroupItem,
} from "@/components/ui"
import { useRef, useState } from "react"
import { ControllerRenderProps, FormProviderProps, UseFormReturn } from "react-hook-form"
import { BookSearchList } from "./book-search-list"
import { Button } from "@/components/ui/buttons"

interface Props {
	field: ControllerRenderProps<
		{
			book: string
			startDate: Date
			intervalPageLength: string
			joinInProgress: boolean
			isCurrent: boolean
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
