"use client"

import { useClubMembership } from "@/contexts"
import { InviteCode } from "@/lib/types"
import { useQuery } from "react-query"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	Avatar,
	AvatarImage,
	AvatarFallback,
	Skeleton,
} from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { toast } from "sonner"

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
								toast.success("link copied")
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

	const { data: inviteCodes, isLoading: loading } = useQuery<InviteCode[]>({
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
				throw new Error(body.error)
			}

			return await response.json()
		},
	})

	return !loading && inviteCodes ? <DataTable columns={columns} data={inviteCodes} /> : <InviteCodesSkeleton />
}

function InviteCodesSkeleton() {
	return <Skeleton className="h-48" />
}
