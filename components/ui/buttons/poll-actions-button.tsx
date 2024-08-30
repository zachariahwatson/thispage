"use client"

import { useState } from "react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { useClubMembership, usePoll } from "@/contexts"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"
import { QueryError } from "@/utils/errors"
import { buttonVariants } from "@/components/ui/buttons/button"
import { EditPollForm } from "@/components/ui/forms/update"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function PollActionsButton() {
	const [editVisible, setEditVisible] = useState<boolean>(false)
	const [deleteVisible, setDeleteVisible] = useState<boolean>(false)
	const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
	const pollData = usePoll()
	const clubMembership = useClubMembership()
	const queryClient = useQueryClient()

	const deletePollMutation = useMutation({
		mutationFn: async () => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/polls/${pollData?.id}`)
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
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
			setDeleteVisible(false)
		},
		onSuccess: (body: any) => {
			toast.success(body.message)
			queryClient.invalidateQueries(["polls", clubMembership?.club.id])
			queryClient.invalidateQueries(["spreads count", clubMembership?.club.id, clubMembership?.role])
		},
	})

	const updatePollMutation = useMutation({
		mutationFn: async (data: {
			editor_member_id: number
			is_locked: boolean
			name: string
			description?: string | undefined
		}) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/polls/${pollData?.id}`)
			const response = await fetch(url, {
				method: "PATCH",
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
			setEditVisible(false)
		},
		onSuccess: (body: any) => {
			toast.success(body.message)
			queryClient.invalidateQueries(["polls", clubMembership?.club.id])
		},
	})

	return (
		<>
			{clubMembership?.role === "admin" && (
				<>
					<div className="absolute top-2 right-4 z-10">
						<DropdownMenu onOpenChange={setDropdownVisible}>
							<DropdownMenuTrigger>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
									/>
								</svg>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{!pollData?.is_finished && (
									<>
										<DropdownMenuItem className="cursor-pointer" onSelect={() => setEditVisible(true)}>
											edit
										</DropdownMenuItem>
										<DropdownMenuSeparator />
									</>
								)}
								<DropdownMenuItem className="text-destructive cursor-pointer" onSelect={() => setDeleteVisible(true)}>
									delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<Sheet open={editVisible && !dropdownVisible} onOpenChange={setEditVisible}>
						<SheetContent className="sm:max-w-xl max-w-xl w-full space-y-4 overflow-scroll">
							<SheetHeader>
								<SheetTitle>edit poll</SheetTitle>
							</SheetHeader>
							<EditPollForm mutation={updatePollMutation} setVisible={setEditVisible} />
						</SheetContent>
					</Sheet>

					<AlertDialog open={deleteVisible && !dropdownVisible} onOpenChange={setDeleteVisible}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									are you sure you want to delete the poll <strong>{pollData?.name}</strong>?
								</AlertDialogTitle>
								<AlertDialogDescription>this action cannot be undone.</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={deletePollMutation.isLoading}>cancel</AlertDialogCancel>
								{deletePollMutation.isLoading ? (
									<Button disabled variant="destructive">
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
										deleting...
									</Button>
								) : (
									<AlertDialogAction
										className={buttonVariants({ variant: "destructive" })}
										onClick={(e) => {
											deletePollMutation.mutate()
											e.preventDefault()
										}}
									>
										delete
									</AlertDialogAction>
								)}
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			)}
		</>
	)
}
