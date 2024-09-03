"use client"

import { BookSearch } from "@/components/ui/books/club/spreads/dashboard"
import { Button } from "@/components/ui/buttons"
import { Form, FormField } from "@/components/ui/forms"
import { useClubMembership, usePoll } from "@/contexts"
import { addPollItemFormSchema } from "@/lib/zod"
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
			creator_member_id: number | null
			poll_id: number
		},
		unknown
	>
	setVisible: Dispatch<SetStateAction<boolean>>
}

export function AddPollItemForm({ mutation, setVisible }: Props) {
	const clubMembership = useClubMembership()
	const pollData = usePoll()

	// 1. Define your form.
	const form = useForm<z.infer<typeof addPollItemFormSchema>>({
		resolver: zodResolver(addPollItemFormSchema),
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof addPollItemFormSchema>) {
		const parsedBook = JSON.parse(values.book)

		// Prepare the mutation payload
		const payload: any = {
			book: {
				open_library_id: parsedBook.openLibraryId,
				title: parsedBook.title,
				description: parsedBook.description,
				authors: parsedBook.authors,
				page_count: parsedBook.pageCount,
				cover_image_url: parsedBook.coverImageUrl,
			},
			poll_id: pollData?.id || -1,
			creator_member_id: clubMembership?.id || -1,
		}

		mutation.mutate(payload)
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField control={form.control} name="book" render={({ field }) => <BookSearch field={field} />} />
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
							disabled={mutation.isLoading}
						>
							cancel
						</Button>
					</div>
				</form>
			</Form>
		</>
	)
}
