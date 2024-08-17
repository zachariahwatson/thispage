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
import { ClubMembership, Post } from "@/lib/types"
import { useRouter } from "next/navigation"
import { EditPostForm } from "../edit-post-form"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

interface Props {
	post: Post
	clubMembership: ClubMembership
}

export function PostActionsButton({ post, clubMembership }: Props) {
	const [editVisible, setEditVisible] = useState<boolean>(false)
	const [leaveVisible, setLeaveVisible] = useState<boolean>(false)
	const [deleteVisible, setDeleteVisible] = useState<boolean>(false)
	const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
	const { data: user, isLoading: loading } = useUser()
	const router = useRouter()

	const queryClient = useQueryClient()

	const deletePostMutation = useMutation({
		mutationFn: () => {
			const url = new URL(
				`${defaultUrl}/api/clubs/${post.reading.club.id}/readings/${post.reading.id}/posts/${post.id}`
			)
			return fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})
		},
		onSuccess: () => {
			toast.success("post successfully deleted")
			queryClient.invalidateQueries(["posts", post.reading.club.id, post.reading.id])
			router.push(`/#club-${post.reading.club.id}`)
		},
	})

	const updatePostMutation = useMutation({
		mutationFn: (data: { editor_member_id: number; content: string; is_spoiler: boolean }) => {
			const url = new URL(
				`${defaultUrl}/api/clubs/${post.reading.club.id}/readings/${post.reading.id}/posts/${post.id}`
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
			toast.success("successfully updated post")
			queryClient.invalidateQueries(["post", String(post.reading.club.id), String(post.reading.id), String(post.id)])
		},
	})

	return (
		<>
			<div className="absolute top-0 right-0">
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
						{!loading && user.id === post.member?.id ? (
							<>
								<DropdownMenuItem className="cursor-pointer" onSelect={() => setEditVisible(true)}>
									edit
								</DropdownMenuItem>
								<DropdownMenuSeparator />
							</>
						) : (
							(clubMembership.role === "moderator" || clubMembership.role === "admin") &&
							!post.is_spoiler && (
								<>
									<DropdownMenuItem
										className="cursor-pointer"
										onSelect={() =>
											updatePostMutation.mutate({
												is_spoiler: true,
												editor_member_id: clubMembership.id,
												content: post.content,
											})
										}
									>
										mark as spoiler
									</DropdownMenuItem>
									<DropdownMenuSeparator />
								</>
							)
						)}

						{((!loading && clubMembership?.club.creator_user_id === user.id) ||
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
						<SheetTitle>edit post</SheetTitle>
					</SheetHeader>
					<EditPostForm
						mutation={updatePostMutation}
						setVisible={setEditVisible}
						post={post}
						clubMembership={clubMembership}
					/>
				</SheetContent>
			</Sheet>

			<AlertDialog open={deleteVisible && !dropdownVisible} onOpenChange={setDeleteVisible}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>are you sure you want to delete this post?</AlertDialogTitle>
						<AlertDialogDescription>this action cannot be undone.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>cancel</AlertDialogCancel>
						<AlertDialogAction className="bg-destructive" onClick={() => deletePostMutation.mutate()}>
							delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
