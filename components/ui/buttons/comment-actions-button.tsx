"use client"

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
import { useUser } from "@/hooks/state"
import { ClubMembership, Comment as CommentType } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"
import { EditCommentForm } from "@/components/ui/forms/update"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

interface Props {
	commentData: CommentType | CommentType["comments"][number]
	clubId: string
	readingId: string
	postId: string
	clubMembership: ClubMembership
}

export function CommentActionsButton({ commentData, clubId, readingId, postId, clubMembership }: Props) {
	const [editVisible, setEditVisible] = useState<boolean>(false)
	const [deleteVisible, setDeleteVisible] = useState<boolean>(false)
	const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
	const { data: user, isLoading: loading } = useUser()
	const router = useRouter()

	const queryClient = useQueryClient()

	const deleteCommentMutation = useMutation({
		mutationFn: () => {
			const url = new URL(
				`${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/comments/${commentData.id}`
			)
			return fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})
		},
		onSuccess: () => {
			toast.success("comment successfully deleted")
			queryClient.invalidateQueries(["comments", clubId, readingId, postId])
		},
	})

	const updateCommentMutation = useMutation({
		mutationFn: (data: { content: string }) => {
			const url = new URL(
				`${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/comments/${commentData.id}`
			)
			return fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
		},
		onSuccess: () => {
			toast.success("successfully updated comment")
			queryClient.invalidateQueries(["comments", clubId, readingId, postId])
		},
	})

	return (
		<>
			<div className="">
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
					<DropdownMenuContent align="start">
						{!loading && user.id === commentData.member?.id && (
							<>
								<DropdownMenuItem className="cursor-pointer" onSelect={() => setEditVisible(true)}>
									edit
								</DropdownMenuItem>
								<DropdownMenuSeparator />
							</>
						)}

						{((user && !loading && commentData.member?.id === user.id) ||
							clubMembership.role === "moderator" ||
							clubMembership.role === "admin") && (
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
						<SheetTitle>edit comment</SheetTitle>
					</SheetHeader>
					<EditCommentForm mutation={updateCommentMutation} setVisible={setEditVisible} commentData={commentData} />
				</SheetContent>
			</Sheet>

			<AlertDialog open={deleteVisible && !dropdownVisible} onOpenChange={setDeleteVisible}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>are you sure you want to delete this comment?</AlertDialogTitle>
						<AlertDialogDescription>this action cannot be undone.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>cancel</AlertDialogCancel>
						<AlertDialogAction className="bg-destructive" onClick={() => deleteCommentMutation.mutate()}>
							delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
