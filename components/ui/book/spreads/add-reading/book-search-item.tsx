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
import { MutableRefObject, useRef, useState } from "react"
import { ControllerRenderProps, FormProviderProps, UseFormReturn } from "react-hook-form"
import { BookSearchList } from "./book-search-list"
import { Button } from "@/components/ui/buttons"

interface Props {
	item: any
	radioRef: MutableRefObject<HTMLDivElement | null>
}

export function BookSearchItem({ item, radioRef }: Props) {
	return (
		<FormItem className="flex flex-row items-center space-x-3 space-y-0">
			<FormControl>
				<RadioGroupItem value={item.key} />
			</FormControl>
			<FormLabel className={`w-full h-full cursor-pointer rounded-md border p-4`}>{item.title}</FormLabel>
		</FormItem>
	)
}
