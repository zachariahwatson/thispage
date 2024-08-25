"use client"

import { useMutation, useQueryClient } from "react-query"
import { Button } from "./button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useClubMembership, useReading } from "@/contexts"
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
		onSuccess: () => {
			toast.success("archived reading!")
			queryClient.invalidateQueries(["readings", clubMembership?.club.id])
		},
	})

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" className="mt-4">
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
					<AlertDialogCancel>cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive"
						onClick={() => mutation.mutate({ editor_member_id: clubMembership?.id || -1, is_archived: true })}
					>
						archive
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
