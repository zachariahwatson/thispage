"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addReadingFormSchema, editReadingFormSchema, settingsFormSchema } from "@/lib/zod"
import { Button } from "@/components/ui/buttons"
import {
	Calendar,
	Checkbox,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	RadioGroup,
	RadioGroupItem,
} from "@/components/ui"
import { UseMutationResult, useMutation, useQuery } from "react-query"
import { toast } from "sonner"
import { revalidatePath } from "next/cache"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useUser } from "@/hooks/state"
import { BookSearch } from "./book"
import { useClubMembership, useReading } from "@/contexts"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface Props {
	mutation: UseMutationResult<
		Response,
		unknown,
		{
			editor_member_id: number
			interval_page_length: number
			// start_date: Date
			join_in_progress: boolean
		},
		unknown
	>
	setVisible: Dispatch<SetStateAction<boolean>>
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function EditReadingForm({ mutation, setVisible }: Props) {
	const clubMembership = useClubMembership()
	const readingData = useReading()

	// 1. Define your form.
	const form = useForm<z.infer<typeof editReadingFormSchema>>({
		resolver: zodResolver(editReadingFormSchema),
		defaultValues: {
			intervalPageLength: String(readingData?.interval_page_length),
			joinInProgress: readingData?.join_in_progress,
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof editReadingFormSchema>) {
		// const startDate = new Date(values.startDate || readingData?.start_date || "")
		// startDate.setHours(0, 0, 0, 0)
		console.log(values, clubMembership?.id)
		mutation.mutate({
			editor_member_id: clubMembership?.id || -1,
			// start_date: startDate,
			interval_page_length: Number(values.intervalPageLength),
			join_in_progress: values.joinInProgress,
		})
		setVisible(false)
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
						name="intervalPageLength"
						render={({ field }) => (
							<FormItem>
								<FormLabel>interval page length</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
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
					{mutation.isLoading ? (
						<Button disabled className="float-right">
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
						<Button type="submit" className="float-right">
							save
						</Button>
					)}
				</form>
			</Form>
		</>
	)
}
