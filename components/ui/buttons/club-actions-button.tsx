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
import { useIntervals, useUser, useUserProgress } from "@/hooks/state"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../sheet"
import { EditReadingForm } from "../edit-reading-form"
import { EditClubForm } from "../edit-club-form"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function ClubActionsButton() {
	const [editVisible, setEditVisible] = useState<boolean>(false)
	const [leaveVisible, setLeaveVisible] = useState<boolean>(false)
	const [deleteVisible, setDeleteVisible] = useState<boolean>(false)
	const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
	const clubMembership = useClubMembership()
	const { data: user, isLoading: loading } = useUser()

	const queryClient = useQueryClient()

	const deleteClubMutation = useMutation({
		mutationFn: () => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}`)
			return fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})
		},
		onSuccess: () => {
			toast.success("club successfully deleted")
			queryClient.invalidateQueries(["clubs"])
		},
	})

	const leaveClubMutation = useMutation({
		mutationFn: () => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/members/${clubMembership?.id}`)
			return fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})
		},
		onSuccess: () => {
			toast.success("successfully left club")
			queryClient.invalidateQueries(["clubs"])
		},
	})

	const updateClubMutation = useMutation({
		mutationFn: (data: { editor_member_id: number; name: string; description: string }) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}`)
			return fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
		},
		onSuccess: () => {
			toast.success("successfully updated club")
			queryClient.invalidateQueries(["clubs"])
		},
	})

	return (
		<>
			<div className="absolute top-0 md:top-2 right-0">
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

						<DropdownMenuItem className="text-destructive cursor-pointer" onSelect={() => setLeaveVisible(true)}>
							leave
						</DropdownMenuItem>
						{!loading && user && clubMembership?.club.creator_user_id === user.id && (
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
						<SheetTitle>edit club</SheetTitle>
					</SheetHeader>
					<EditClubForm mutation={updateClubMutation} setVisible={setEditVisible} />
				</SheetContent>
			</Sheet>

			<AlertDialog open={leaveVisible && !dropdownVisible} onOpenChange={setLeaveVisible}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>are you sure you want to leave {clubMembership?.club.name}?</AlertDialogTitle>
						<AlertDialogDescription>you will have to be invited to join this club again.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>cancel</AlertDialogCancel>
						<AlertDialogAction className="bg-destructive" onClick={() => leaveClubMutation.mutate()}>
							leave
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={deleteVisible && !dropdownVisible} onOpenChange={setDeleteVisible}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>are you sure you want to delete {clubMembership?.club.name}?</AlertDialogTitle>
						<AlertDialogDescription>this action cannot be undone.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>cancel</AlertDialogCancel>
						<AlertDialogAction className="bg-destructive" onClick={() => deleteClubMutation.mutate()}>
							delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
