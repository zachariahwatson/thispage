"use client"

import { useRef, useState } from "react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../alert-dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../dropdown-menu"
import { useClubMembership, useReading } from "@/contexts"
import { useIntervals, useUserProgress } from "@/hooks/state"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../sheet"
import { EditReadingForm } from "../edit-reading-form"

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

	const { data: intervals } = useIntervals(clubMembership?.club.id || null, readingData?.id || null)

	const interval = (intervals && intervals[0]) || null

	const { data: userProgress } = useUserProgress(interval?.id || null, clubMembership?.id || null)

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
		onSuccess: () => {
			toast.success("reading successfully deleted")
			queryClient.invalidateQueries(["readings", clubMembership?.club.id])
		},
	})

	const leaveReadingMutation = useMutation({
		mutationFn: () => {
			const url = new URL(`${defaultUrl}/api/users/progresses/${clubMembership?.id}/intervals/${interval?.id}`)
			return fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})
		},
		onSuccess: () => {
			toast.success("successfully left reading")
			queryClient.invalidateQueries(["user progress", interval?.id])
			queryClient.invalidateQueries(["intervals", clubMembership?.club.id, readingData?.id])
		},
	})

	const updateReadingMutation = useMutation({
		mutationFn: (data: {
			editor_member_id: number
			// start_date: Date
			interval_page_length: number
			join_in_progress: boolean
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
		onSuccess: () => {
			toast.success("successfully updated reading")
			queryClient.invalidateQueries(["readings", clubMembership?.club.id])
		},
	})

	return (
		<>
			{(userProgress || clubMembership?.role === "admin") && (
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
								{clubMembership?.role === "admin" && (
									<>
										<DropdownMenuItem className="cursor-pointer" onSelect={() => setEditVisible(true)}>
											edit
										</DropdownMenuItem>
										<DropdownMenuSeparator />
									</>
								)}

								{userProgress && (
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
							<EditReadingForm mutation={updateReadingMutation} setVisible={setEditVisible} />
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
								<AlertDialogCancel>cancel</AlertDialogCancel>
								<AlertDialogAction className="bg-destructive" onClick={() => leaveReadingMutation.mutate()}>
									leave
								</AlertDialogAction>
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
								<AlertDialogCancel>cancel</AlertDialogCancel>
								<AlertDialogAction className="bg-destructive" onClick={() => deleteReadingMutation.mutate()}>
									delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			)}
		</>
	)
}
