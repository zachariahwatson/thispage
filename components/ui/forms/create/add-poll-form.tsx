"use client"

import { Checkbox, Input, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { useClubMembership } from "@/contexts"
import { addPollFormSchema } from "@/lib/zod"
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
			club_id: number
			creator_member_id: number
			end_date: string
			is_locked: boolean
			name: string
			description?: string | undefined
		},
		unknown
	>
	setVisible: Dispatch<SetStateAction<boolean>>
}

export function AddPollForm({ mutation, setVisible }: Props) {
	const clubMembership = useClubMembership()
	// 1. Define your form.
	const form = useForm<z.infer<typeof addPollFormSchema>>({
		resolver: zodResolver(addPollFormSchema),
		defaultValues: {
			isLocked: false,
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof addPollFormSchema>) {
		const endDate = new Date(values.endDate)
		endDate.setHours(24, 0, 0, 0)
		// Prepare the mutation payload
		const payload: any = {
			club_id: clubMembership?.club.id || -1,
			creator_member_id: clubMembership?.id || -1,
			end_date: endDate,
			is_locked: values.isLocked,
			name: values.name,
			description: values.description,
		}

		mutation.mutate(payload)
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>description</FormLabel>
								<FormControl>
									<Textarea className="h-40" placeholder="optional" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="endDate"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>end date</FormLabel>
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
							name="isLocked"
							render={({ field }) => (
								<FormItem>
									<div className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel>locked</FormLabel>
									</div>
									<FormDescription>if you lock your poll, only admins will be able to add books.</FormDescription>
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
