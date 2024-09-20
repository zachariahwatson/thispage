"use client"

import { Checkbox, Input, Textarea } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { useClubMembership } from "@/contexts"
import { useSpreadsCount } from "@/hooks/state"
import { addPollFormSchema } from "@/lib/zod"
import { QueryError } from "@/utils/errors"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"
import { z } from "zod"

interface Props {
	setVisible: Dispatch<SetStateAction<boolean>>
	setUserSpreadIndex: React.Dispatch<React.SetStateAction<number>>
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function AddPollForm({ setVisible, setUserSpreadIndex }: Props) {
	const clubMembership = useClubMembership()
	const { data: spreadsCount } = useSpreadsCount(clubMembership?.club.id || -1, clubMembership?.role || "member")
	const queryClient = useQueryClient()

	// 1. Define your form.
	const form = useForm<z.infer<typeof addPollFormSchema>>({
		resolver: zodResolver(addPollFormSchema),
		defaultValues: {
			isLocked: false,
			votingPeriodLength: "7",
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof addPollFormSchema>) {
		// Prepare the mutation payload
		const payload: any = {
			club_id: clubMembership?.club.id || -1,
			creator_member_id: clubMembership?.id || -1,
			voting_length_days: Number(values.votingPeriodLength),
			is_locked: values.isLocked,
			name: values.name,
			description: values.description,
		}

		mutation.mutate(payload)
	}

	const mutation = useMutation({
		mutationFn: async (data: {
			club_id: number
			creator_member_id: number
			voting_length_days: number
			is_locked: boolean
			name: string
			description?: string | undefined
		}) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/polls`)
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			if (!response.ok) {
				const body = await response.json()
				throw new QueryError(body.message, body.code)
			}

			return await response.json()
		},
		onError: (error: any) => {
			toast.error(error.message, { description: error.code })
		},
		onSettled: () => {
			setVisible(false)
		},
		onSuccess: (body: any) => {
			toast.success(body.message)
			queryClient.invalidateQueries(["spreads count", clubMembership?.club.id, clubMembership?.role])
			queryClient.invalidateQueries(["polls", clubMembership?.club.id])
			let index = 0
			if (spreadsCount) {
				if (spreadsCount.total_readings) index += spreadsCount.total_readings
				if (spreadsCount.total_polls) index += spreadsCount.total_polls
			}
			localStorage.setItem(`club-${clubMembership?.club.id}-member-${clubMembership?.id}-tab-index`, index.toString())
			setUserSpreadIndex(index)
		},
	})

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
						name="votingPeriodLength"
						render={({ field }) => (
							<FormItem>
								<FormLabel>voting period length (days)</FormLabel>
								<FormControl>
									<Input type="number" placeholder="7" {...field} />
								</FormControl>
								<FormDescription>how many days your poll will last after the selection period.</FormDescription>
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
							variant="accent"
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
