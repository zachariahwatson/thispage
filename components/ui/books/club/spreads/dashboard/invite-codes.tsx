"use client"

import { useClubMembership } from "@/contexts"
import { InviteCode } from "@/lib/types"
import { useQuery } from "react-query"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Tooltip, TooltipTrigger, TooltipContent, Avatar, AvatarImage, AvatarFallback, Skeleton } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { toast } from "sonner"
import { QueryError } from "@/utils/errors"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

const columns: ColumnDef<InviteCode>[] = [
	{
		accessorKey: "creator",
		header: "creator",
		cell: ({ row }) => {
			const creator: InviteCode["creator"] = row.getValue("creator")
			return (
				<Tooltip>
					<TooltipTrigger className="cursor-default">
						<Avatar>
							<AvatarImage src={creator?.avatar_url || ""} />
							<AvatarFallback>
								{creator?.first_name && creator?.last_name
									? creator.first_name[0] + creator.last_name[0]
									: creator?.name && creator?.name?.split(" ")[0][0] + creator?.name?.split(" ")[1][0]}
							</AvatarFallback>
						</Avatar>
					</TooltipTrigger>
					<TooltipContent>
						{creator?.first_name && creator?.last_name ? creator.first_name + " " + creator.last_name : creator?.name}
					</TooltipContent>
				</Tooltip>
			)
		},
	},
	{
		accessorKey: "uses",
		header: "uses",
	},
	{
		header: "copy link",
		id: "actions",
		cell: ({ row }) => {
			const invite = row.original

			return (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							onClick={() => {
								navigator.clipboard.writeText(`${defaultUrl}/invite/${invite.club_id}/${invite.code}`)
								toast.success("link copied!")
							}}
							className="p-2"
						>
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
									d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
								/>
							</svg>
						</Button>
					</TooltipTrigger>
					<TooltipContent>copy link</TooltipContent>
				</Tooltip>
			)
		},
	},
]

/**
 * @todo decrement the uses and add expiration date functionality
 */
export function InviteCodes() {
	const clubMembership = useClubMembership()

	const {
		data: inviteCodes,
		isLoading: loading,
		error,
		refetch,
	} = useQuery<InviteCode[]>({
		queryKey: ["invite codes", clubMembership?.club.id],
		queryFn: async () => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/invite-codes`)
			const response = await fetch(url, {
				method: "GET",
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
	})

	return !error ? (
		!loading && inviteCodes ? (
			<DataTable columns={columns} data={inviteCodes} />
		) : (
			<InviteCodesSkeleton />
		)
	) : (
		<div className="p-3 md:p-4 bg-destructive/15 flex flex-col justify-center items-center h-48 text-destructive space-y-2 rounded-md">
			<div className="flex flex-row justify-center items-center w-full">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-16 mr-2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
					/>
				</svg>
				<div>
					<p>{(error as QueryError).message}</p>
					<p className="text-muted-foreground">{(error as QueryError).code}</p>
				</div>
			</div>
			<Button
				variant="accent"
				onClick={(e) => {
					e.preventDefault()
					refetch()
				}}
			>
				retry
			</Button>
		</div>
	)
}

function InviteCodesSkeleton() {
	return <Skeleton className="h-48" />
}
