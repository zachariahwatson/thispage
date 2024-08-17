"use client"

import { useClubMembership } from "@/contexts"
import { InviteCode, Member } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "react-query"
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
import { DataTableMembers } from "@/components/ui/data-table-members"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function MemberList() {
	const clubMembership = useClubMembership()
	const queryClient = useQueryClient()
	const [promoteVisible, setPromoteVisible] = useState<boolean>(false)
	const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)

	const updateRoleMutation = useMutation({
		mutationFn: (data: { editor_member_id: number; member_id: number; role: string }) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/member-roles/${data.member_id}`)
			return fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
		},
		onSuccess: () => {
			toast.success("successfully updated member role")
			queryClient.invalidateQueries(["members", clubMembership?.club.id])
		},
	})

	const kickMemberMutation = useMutation({
		mutationFn: (data: { member_id: number }) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/members/${data.member_id}`)
			return fetch(url, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})
		},
		onSuccess: () => {
			toast.success("successfully kicked member")
			queryClient.invalidateQueries(["members", clubMembership?.club.id])
		},
	})

	const columns: ColumnDef<Member>[] = [
		{
			accessorKey: "name",
			header: "member",
			cell: ({ row }) => {
				const member = row.original
				return (
					<div className="flex flex-row items-center space-x-4">
						<Avatar>
							<AvatarImage src={member?.avatar_url || ""} />
							<AvatarFallback>
								{member?.first_name && member?.last_name
									? member.first_name[0] + member.last_name[0]
									: member?.name && member?.name?.split(" ")[0] + member?.name?.split(" ")[1]}
							</AvatarFallback>
						</Avatar>
						<p>{member?.first_name && member?.last_name ? member.first_name + " " + member.last_name : member?.name}</p>
					</div>
				)
			},
			size: 10,
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
						<>
							<DropdownMenu onOpenChange={setDropdownVisible}>
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
													<DropdownMenuItem className="cursor-pointer" onSelect={() => setPromoteVisible(true)}>
														promote to admin
													</DropdownMenuItem>
													<DropdownMenuItem
														className="cursor-pointer"
														onSelect={() =>
															updateRoleMutation.mutate({
																editor_member_id: clubMembership.id,
																member_id: member.id,
																role: "member",
															})
														}
													>
														demote to member
													</DropdownMenuItem>
												</>
											) : (
												<DropdownMenuItem
													className="cursor-pointer"
													onSelect={() =>
														updateRoleMutation.mutate({
															editor_member_id: clubMembership.id,
															member_id: member.id,
															role: "moderator",
														})
													}
												>
													promote to moderator
												</DropdownMenuItem>
											)}

											<DropdownMenuSeparator />
											<DropdownMenuItem
												className="text-destructive cursor-pointer"
												onSelect={() =>
													kickMemberMutation.mutate({
														member_id: member.id,
													})
												}
											>
												kick
											</DropdownMenuItem>
										</>
									) : (
										member.role === "member" &&
										clubMembership?.role === "moderator" && (
											<DropdownMenuItem
												className="text-destructive cursor-pointer"
												onSelect={() =>
													kickMemberMutation.mutate({
														member_id: member.id,
													})
												}
											>
												kick
											</DropdownMenuItem>
										)
									)}
								</DropdownMenuContent>
							</DropdownMenu>
							<AlertDialog open={promoteVisible && !dropdownVisible} onOpenChange={setPromoteVisible}>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>are you sure?</AlertDialogTitle>
										<AlertDialogDescription>this action cannot be undone.</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() =>
												updateRoleMutation.mutate({
													editor_member_id: clubMembership?.id || -1,
													member_id: member.id,
													role: "admin",
												})
											}
										>
											promote
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</>
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

	return !loading && members ? <DataTableMembers columns={columns} data={members} /> : <MemberListSkeleton />
}

function MemberListSkeleton() {
	return <Skeleton className="h-48" />
}
