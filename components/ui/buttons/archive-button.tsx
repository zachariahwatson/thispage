"use client"

import { useClubMembership, useReading } from "@/contexts"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"
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
} from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { useState } from "react"

interface Props {
	readingId: number | null
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function ArchiveButton() {
	const clubMembership = useClubMembership()
	const queryClient = useQueryClient()
	const readingData = useReading()
	const [archiveVisible, setArchiveVisible] = useState<boolean>(false)
	const mutation = useMutation({
		mutationFn: (data: { editor_member_id: number; is_archived: boolean }) => {
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
			setArchiveVisible(false)
		},
		onSuccess: () => {
			toast.success("archived reading!")
			queryClient.invalidateQueries(["readings", clubMembership?.club.id])
		},
	})

	return (
		<AlertDialog open={archiveVisible} onOpenChange={setArchiveVisible}>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" className="mt-4 mx-1">
					archive
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						are you sure you want to archive this reading of {readingData?.book_title}?
					</AlertDialogTitle>
					<AlertDialogDescription>
						readers will no longer be able to create discussion posts or leave comments, and the reading will be moved
						to the archive section.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={mutation.isLoading}>cancel</AlertDialogCancel>
					{mutation.isLoading ? (
						<Button disabled className="bg-destructive">
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
							archiving...
						</Button>
					) : (
						<AlertDialogAction
							onClick={(e) => {
								mutation.mutate({ editor_member_id: clubMembership?.id || -1, is_archived: true })
								e.preventDefault()
							}}
							className="bg-destructive"
						>
							archive
						</AlertDialogAction>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
