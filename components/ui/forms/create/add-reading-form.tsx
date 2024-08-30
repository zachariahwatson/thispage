"use client"

import { Checkbox, Input, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui"
import { BookSearch } from "@/components/ui/books/club/spreads/dashboard"
import { Button } from "@/components/ui/buttons"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { useClubMembership } from "@/contexts"
import { addReadingFormSchema } from "@/lib/zod"
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
			book: {
				open_library_id: string
				title?: string | undefined
				description?: string | undefined
				authors?: string[] | undefined
				page_count?: number | undefined
				cover_image_url?: string | undefined
			}
			club_id: number
			creator_member_id: number
			interval_page_length?: number
			interval_section_length?: number
			start_date: string
			join_in_progress: boolean
			increment_type: "pages" | "sections"
			book_sections?: number | undefined
			section_name?: string | undefined
		},
		unknown
	>
	setVisible: Dispatch<SetStateAction<boolean>>
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function AddReadingForm({ mutation, setVisible }: Props) {
	const clubMembership = useClubMembership()
	// 1. Define your form.
	const form = useForm<z.infer<typeof addReadingFormSchema>>({
		resolver: zodResolver(addReadingFormSchema),
		defaultValues: {
			intervalPageLength: "10",
			intervalSectionLength: "1",
			joinInProgress: true,
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof addReadingFormSchema>) {
		const parsedBook = JSON.parse(values.book)
		const startDate = new Date(values.startDate)
		startDate.setHours(24, 0, 0, 0)
		// Prepare the mutation payload
		const payload: any = {
			book: {
				open_library_id: parsedBook.openLibraryId,
				title: parsedBook.title,
				description: parsedBook.description.value,
				authors: parsedBook.authors,
				page_count: parsedBook.pageCount,
				cover_image_url: values.bookCoverImageURL || parsedBook.coverImageUrl,
			},
			club_id: clubMembership?.club.id || -1,
			creator_member_id: clubMembership?.id || -1,
			start_date: startDate,
			join_in_progress: values.joinInProgress,
			increment_type: values.incrementType,
		}
		// Add fields conditionally based on incrementType
		if (values.incrementType === "pages" || values.incrementType === undefined) {
			payload.interval_page_length = Number(values.intervalPageLength)
		} else if (values.incrementType === "sections") {
			payload.book_sections = Number(values.bookSections)
			payload.interval_section_length = Number(values.intervalSectionLength)
			payload.section_name = values.sectionName
		}

		mutation.mutate(payload)
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField control={form.control} name="book" render={({ field }) => <BookSearch field={field} />} />
					<FormField
						control={form.control}
						name="bookCoverImageURL"
						render={({ field }) => (
							<FormItem>
								<FormLabel>custom cover image url</FormLabel>
								<FormControl>
									<Input placeholder="optional" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="startDate"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>start date</FormLabel>
								<FormControl className="flex justify-center">
									<Input type="date" placeholder="mm / dd / yyyy" {...field} />
								</FormControl>
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

					<div className="space-y-2">
						<FormLabel>increment type</FormLabel>
						<Tabs
							defaultValue="pages"
							onValueChange={(value) => form.setValue("incrementType", value as "pages" | "sections")}
						>
							<TabsList>
								<TabsTrigger value="pages">pages</TabsTrigger>
								<TabsTrigger value="sections">sections</TabsTrigger>
							</TabsList>
							<TabsContent value="pages" className="space-y-8">
								<FormDescription>track book progress using goal pages.</FormDescription>
								<FormField
									control={form.control}
									name="intervalPageLength"
									render={({ field }) => (
										<FormItem>
											<FormLabel>goal page increment amount</FormLabel>
											<FormControl>
												<Input type="number" {...field} />
											</FormControl>
											<FormDescription>
												how many pages your readers will read in order to reach the next goal.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</TabsContent>
							<TabsContent value="sections" className="space-y-8">
								<FormDescription>track book progress using custom sections.</FormDescription>
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
												<Input placeholder="section" {...field} />
											</FormControl>
											<FormDescription>"chapter", "story", "part", etc.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</TabsContent>
						</Tabs>
					</div>
					<FormField
						control={form.control}
						name="incrementType"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input type="hidden" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
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
								adding...
							</Button>
						) : (
							<Button type="submit">add</Button>
						)}
						<Button
							variant="secondary"
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