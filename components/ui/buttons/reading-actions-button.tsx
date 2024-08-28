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
import { useClubMembership, useReading } from "@/contexts"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"
import { EditReadingFormPages, EditReadingFormSections } from "@/components/ui/forms/update"
import { buttonVariants } from "@/components/ui/buttons/button"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function ReadingActionsButton() {
	const [editVisible, setEditVisible] = useState<boolean>(false)
	const [leaveVisible, setLeaveVisible] = useState<boolean>(false)
	const [deleteVisible, setDeleteVisible] = useState<boolean>(false)
	const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
	const readingData = useReading()
	const clubMembership = useClubMembership()
	const queryClient = useQueryClient()

	const deleteReadingMutation = useMutation({
		mutationFn: () => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/readings/${readingData?.id}`)
			return fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})
		},
		onSettled: () => {
			setDeleteVisible(false)
		},
		onSuccess: () => {
			toast.success("reading successfully deleted")
			queryClient.invalidateQueries(["readings", clubMembership?.club.id])
			queryClient.invalidateQueries(["spreads count", clubMembership?.club.id, clubMembership?.role])
		},
	})

	const leaveReadingMutation = useMutation({
		mutationFn: () => {
			const url = new URL(
				`${defaultUrl}/api/users/progresses/${clubMembership?.id}/intervals/${readingData?.interval?.id}`
			)
			return fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})
		},
		onSettled: () => {
			setLeaveVisible(false)
		},
		onSuccess: () => {
			toast.success("successfully left reading")
			queryClient.invalidateQueries(["readings", clubMembership?.club.id])
		},
	})

	const updateReadingMutation = useMutation({
		mutationFn: (data: {
			editor_member_id: number
			// start_date: Date
			interval_page_length?: number
			interval_section_length?: number
			book_sections?: number
			section_name?: string
			join_in_progress: boolean
			book_cover_image_url?: string
		}) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/readings/${readingData?.id}`)
			return fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
		},
		onSettled: () => {
			setEditVisible(false)
		},
		onSuccess: () => {
			toast.success("successfully updated reading")
			queryClient.invalidateQueries(["readings", clubMembership?.club.id])
			queryClient.invalidateQueries(["cover image", readingData?.id])
		},
	})

	return (
		<>
			{(readingData?.interval?.user_progress || clubMembership?.role === "admin") && (
				<>
					<div className="absolute top-2 right-4">
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
								{clubMembership?.role === "admin" && !readingData?.is_finished && (
									<>
										<DropdownMenuItem className="cursor-pointer" onSelect={() => setEditVisible(true)}>
											edit
										</DropdownMenuItem>
										<DropdownMenuSeparator />
									</>
								)}

								{readingData?.interval?.user_progress && (
									<DropdownMenuItem className="text-destructive cursor-pointer" onSelect={() => setLeaveVisible(true)}>
										leave
									</DropdownMenuItem>
								)}
								{clubMembership?.role === "admin" && (
									<DropdownMenuItem className="text-destructive cursor-pointer" onSelect={() => setDeleteVisible(true)}>
										delete
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<Sheet open={editVisible && !dropdownVisible} onOpenChange={setEditVisible}>
						<SheetContent className="sm:max-w-xl max-w-xl w-full space-y-4 overflow-scroll">
							<SheetHeader>
								<SheetTitle>edit reading</SheetTitle>
							</SheetHeader>
							{readingData?.increment_type === "pages" ? (
								<EditReadingFormPages mutation={updateReadingMutation} setVisible={setEditVisible} />
							) : (
								<EditReadingFormSections mutation={updateReadingMutation} setVisible={setEditVisible} />
							)}
						</SheetContent>
					</Sheet>

					<AlertDialog open={leaveVisible && !dropdownVisible} onOpenChange={setLeaveVisible}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									are you sure you want to leave this reading of {readingData?.book_title}?
								</AlertDialogTitle>
								<AlertDialogDescription>you may not be able to join again.</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={leaveReadingMutation.isLoading}>cancel</AlertDialogCancel>
								{leaveReadingMutation.isLoading ? (
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
										leaving...
									</Button>
								) : (
									<AlertDialogAction
										className={buttonVariants({ variant: "destructive" })}
										onClick={(e) => {
											leaveReadingMutation.mutate()
											e.preventDefault()
										}}
									>
										leave
									</AlertDialogAction>
								)}
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<AlertDialog open={deleteVisible && !dropdownVisible} onOpenChange={setDeleteVisible}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									are you sure you want to delete this reading of {readingData?.book_title}?
								</AlertDialogTitle>
								<AlertDialogDescription>this action cannot be undone.</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={deleteReadingMutation.isLoading}>cancel</AlertDialogCancel>
								{deleteReadingMutation.isLoading ? (
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
											deleteReadingMutation.mutate()
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
