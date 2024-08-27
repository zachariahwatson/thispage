"use client"

import { Input } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { useClubMembership, useReading } from "@/contexts"
import { createInviteFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"
import { z } from "zod"

interface Props {
	setVisible: Dispatch<SetStateAction<boolean>>
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function CreateInviteForm({ setVisible }: Props) {
	const readingData = useReading()
	const clubMembership = useClubMembership()
	const router = useRouter()
	const queryClient = useQueryClient()
	const inviteMutation = useMutation({
		mutationFn: (data: { club_id: number; uses: number; creator_member_id: number }) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/invite-codes`)
			return fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
		},
		onSuccess: () => {
			toast.success("invite code created!")
			queryClient.invalidateQueries(["invite codes", clubMembership?.club.id])
		},
	})

	// 1. Define your form.
	const form = useForm<z.infer<typeof createInviteFormSchema>>({
		resolver: zodResolver(createInviteFormSchema),
		defaultValues: {
			uses: "10",
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof createInviteFormSchema>) {
		// const expirationDate = new Date(values.expirationDate)
		// expirationDate.setHours(0, 0, 0, 0)
		inviteMutation.mutate({
			club_id: clubMembership?.club.id || -1,
			//expiration_date: expirationDate,
			uses: Number(values.uses),
			creator_member_id: clubMembership?.id || -1,
		})
		setVisible(false)
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="uses"
						render={({ field }) => (
							<FormItem>
								<FormLabel>uses</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* <FormField
						control={form.control}
						name="expirationDate"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>expiration date</FormLabel>
								<FormControl className="flex justify-center">
									<Input type="date" placeholder="mm / dd / yyyy" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/> */}
					{inviteMutation.isLoading ? (
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
							creating...
						</Button>
					) : (
						<Button type="submit" className="float-right">
							create
						</Button>
					)}
				</form>
			</Form>
		</>
	)
}
