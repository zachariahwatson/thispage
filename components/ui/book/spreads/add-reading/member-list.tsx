"use client"

import { useClubMembership } from "@/contexts"
import { InviteCode, Member } from "@/lib/types"
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

export function MemberList() {
	const clubMembership = useClubMembership()

	const columns: ColumnDef<Member>[] = [
		{
			id: "avatar",
			cell: ({ row }) => {
				const member = row.original
				return (
					<Avatar>
						<AvatarImage src={member?.avatar_url || ""} />
						<AvatarFallback>
							{member?.first_name && member?.last_name
								? member.first_name[0] + member.last_name[0]
								: member?.name && member?.name?.split(" ")[0] + member?.name?.split(" ")[1]}
						</AvatarFallback>
					</Avatar>
				)
			},
			size: 10,
		},
		{
			accessorKey: "name",
			header: "name",
			cell: ({ row }) => {
				const member = row.original
				return member?.first_name && member?.last_name ? member.first_name + " " + member.last_name : member?.name
			},
		},
		{
			accessorKey: "role",
			header: "role",
		},
		{
			id: "actions",
			header: "action",
			cell: ({ row }) => {
				const member = row.original

				return (
					clubMembership?.role !== "member" &&
					member.role !== "admin" && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="p-2">
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
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{member.role !== "admin" && clubMembership?.role === "admin" ? (
									<>
										{member.role === "moderator" ? (
											<>
												<DropdownMenuItem className="cursor-pointer">promote to admin</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer">demote to member</DropdownMenuItem>
											</>
										) : (
											<DropdownMenuItem className="cursor-pointer">promote to moderator</DropdownMenuItem>
										)}

										<DropdownMenuSeparator />
										<DropdownMenuItem className="text-destructive cursor-pointer">kick</DropdownMenuItem>
									</>
								) : (
									member.role === "member" &&
									clubMembership?.role === "moderator" && (
										<DropdownMenuItem className="text-destructive cursor-pointer">kick</DropdownMenuItem>
									)
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					)
				)
			},
		},
	]

	const { data: members, isLoading: loading } = useQuery<Member[]>({
		queryKey: ["members", clubMembership?.club.id],
		queryFn: async () => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/members`)
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

	return !loading && members ? <DataTable columns={columns} data={members} /> : <MemberListSkeleton />
}

function MemberListSkeleton() {
	return <Skeleton className="h-48" />
}
