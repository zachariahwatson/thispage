"use client"
import {
	Badge,
	Input,
	Label,
	RadioGroup,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui"
import { BookSearchLanguages, BookSearchList } from "@/components/ui/books/club/spreads/dashboard"
import { Button } from "@/components/ui/buttons"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { useMediaQuery } from "@/hooks"
import { Checkbox, CheckedState } from "@radix-ui/react-checkbox"
import { useRef, useState } from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { useQueryClient } from "react-query"

interface Props<TFieldValues extends FieldValues> {
	field: ControllerRenderProps<TFieldValues, any>
}

export function BookSearch<TFieldValues extends FieldValues>({ field }: Props<TFieldValues>) {
	const queryClient = useQueryClient()
	const [search, setSearch] = useState<string>("")
	const [language, setLanguage] = useState<
		| {
				name: string
				key: string
				count: number
		  }
		| undefined
	>({ name: "English", key: "/languages/eng", count: 18615100 })
	const input = useRef<HTMLInputElement | null>(null)
	const [value, setValue] = useState<string | undefined>()
	const [languagesVisible, setLanguagesVisible] = useState<boolean>(false)

	const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault()
			setSearch(input.current?.value || "")
		}
	}

	const handleValueChange = (newValue: string) => {
		setValue(newValue)
		field.onChange(newValue)
	}

	const handleCheck = () => {
		setLanguage(undefined)
	}

	return (
		<FormItem>
			<FormLabel>book</FormLabel>
			<div className="flex w-full items-center space-x-2">
				<Input ref={input} placeholder="search books" onKeyDown={handleKeyPress} showCharacterCount={false} />
				<Sheet open={languagesVisible} onOpenChange={setLanguagesVisible}>
					<SheetTrigger asChild>
						<Button type="button" variant="outline">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
								/>
							</svg>
						</Button>
					</SheetTrigger>
					<BookSearchLanguages
						language={language}
						setLanguage={setLanguage}
						setLanguagesVisible={setLanguagesVisible}
					/>
				</Sheet>
				<Button type="button" onClick={() => setSearch(input.current?.value || "")}>
					search
				</Button>
			</div>
			{language && (
				<Badge key={language.key} className="mr-2">
					<Checkbox hidden id={language.name} defaultChecked={true} checked={true} onCheckedChange={handleCheck} />
					<Label className="hover:cursor-pointer" htmlFor={language.name}>
						{language.name}
					</Label>
				</Badge>
			)}

			<FormControl>
				<RadioGroup
					defaultValue={value}
					value={value}
					onValueChange={handleValueChange}
					className="flex flex-col space-y-1"
				>
					<BookSearchList search={search} groupValue={value} language={language} />
				</RadioGroup>
			</FormControl>
			<FormMessage />
		</FormItem>
	)
}
