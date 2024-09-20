"use client"

import { Checkbox, Input } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { useClubMembership, useReading } from "@/contexts"
import { editReadingFormSchemaSections } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { UseMutationResult } from "react-query"
import { z } from "zod"

interface Props {
	mutation: UseMutationResult<
		Response,
		unknown,
		{
			editor_member_id: number
			interval_page_length?: number
			interval_section_length?: number
			book_sections?: number
			section_name?: string
			join_in_progress: boolean
		},
		unknown
	>
	setVisible: Dispatch<SetStateAction<boolean>>
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

// Type definition for the form data based on the Zod schema
type EditReadingFormData = z.infer<ReturnType<typeof editReadingFormSchemaSections>>

export function EditReadingFormSections({ mutation, setVisible }: Props) {
	const clubMembership = useClubMembership()
	const readingData = useReading()

	// Create the form schema instance by invoking the schema function
	const schema = editReadingFormSchemaSections(readingData?.book_sections || 0)

	// 1. Define your form.
	const form = useForm<EditReadingFormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			intervalSectionLength: String(readingData?.interval_section_length),
			bookSections: String(readingData?.book_sections) || "0",
			sectionName: readingData?.section_name || "section",
			joinInProgress: readingData?.join_in_progress,
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: EditReadingFormData) {
		// const startDate = new Date(values.startDate || readingData?.start_date || "")
		// startDate.setHours(0, 0, 0, 0)
		mutation.mutate({
			editor_member_id: clubMembership?.id || -1,
			// start_date: startDate,
			interval_section_length: Number(values.intervalSectionLength),
			book_sections: Number(values.bookSections),
			section_name: values.sectionName,
			join_in_progress: values.joinInProgress,
		})
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					{/* <FormField
						control={form.control}
						name="startDate"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>start date (optional)</FormLabel>
								<FormControl className="flex justify-center">
									<Input type="date" placeholder="mm / dd / yyyy" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/> */}
					<FormField
						control={form.control}
						name="bookSections"
						render={({ field }) => (
							<FormItem>
								<FormLabel>section count</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormDescription>how many chapters, stories, etc are in your book.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="intervalSectionLength"
						render={({ field }) => (
							<FormItem>
								<FormLabel>goal section increment amount</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormDescription>
									how many sections your readers will read in order to reach the next goal.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="sectionName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>section name</FormLabel>
								<FormControl>
									<Input initialCharacterCount={field?.value?.length} {...field} />
								</FormControl>
								<FormDescription>"chapter", "story", "part", etc.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex flex-row items-center space-x-4">
						<FormField
							control={form.control}
							name="joinInProgress"
							render={({ field }) => (
								<FormItem>
									<div className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>join in progress</FormLabel>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex flex-col md:flex-row-reverse float-right w-full space-y-2 md:space-y-0">
						{mutation.isLoading ? (
							<Button disabled>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6 animate-spin mr-2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
									/>
								</svg>
								saving...
							</Button>
						) : (
							<Button type="submit">save</Button>
						)}
						<Button
							variant="accent"
							className="md:mr-2"
							onClick={(event) => {
								event.preventDefault()
								setVisible(false)
							}}
						>
							cancel
						</Button>
					</div>
				</form>
			</Form>
		</>
	)
}
