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
			olid: string
			intervalPageLength: string
			joinInProgress: boolean
			isCurrent: boolean
		},
		"olid"
	>
}

export function BookSearch({ field }: Props) {
	const [search, setSearch] = useState<string>("")
	const input = useRef<HTMLInputElement | null>(null)
	const button = useRef<HTMLButtonElement | null>(null)
	const radioGroup = useRef<HTMLDivElement | null>(null)

	return (
		<FormItem>
			<FormLabel>book</FormLabel>
			<div className="flex w-full items-center space-x-2">
				<Input ref={input} placeholder="search books" />
				<Button type="button" onClick={() => setSearch(input.current?.value || "")}>
					search
				</Button>
			</div>
			<FormControl>
				<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
					<BookSearchList search={search} radioRef={radioGroup} />
				</RadioGroup>
			</FormControl>
			<FormMessage />
		</FormItem>
	)
}
