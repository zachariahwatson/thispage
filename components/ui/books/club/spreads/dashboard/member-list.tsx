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
	Avatar,
	AvatarFallback,
	AvatarImage,
	DataTableMembers,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Skeleton,
} from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { useClubMembership } from "@/contexts"
import { Member } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { toast } from "sonner"

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
		onSettled: () => {
			setPromoteVisible(false)
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
									: member?.name && member?.name?.split(" ")[0][0] + member?.name?.split(" ")[1][0]}
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
					((clubMembership?.role === "admin" && member.role !== "admin") ||
						(clubMembership?.role === "moderator" && member.role === "member")) && (
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
										<AlertDialogCancel disabled={updateRoleMutation.isLoading}>cancel</AlertDialogCancel>
										{updateRoleMutation.isLoading ? (
											<Button disabled>
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
												promoting...
											</Button>
										) : (
											<AlertDialogAction
												onClick={(e) => {
													updateRoleMutation.mutate({
														editor_member_id: clubMembership?.id || -1,
														member_id: member.id,
														role: "admin",
													})
													e.preventDefault()
												}}
											>
												promote
											</AlertDialogAction>
										)}
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
