"use client"

import { ClubBook, ClubBookSkeleton } from "@/components/ui/books/club"
import { ClubMembershipProvider } from "@/contexts"
import { useClubs } from "@/hooks/state"

/**
 * returns a list of book clubs. we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function ClubBooks() {
	const { data: clubMemberships, isLoading: loading } = useClubs()

	return !loading ? (
		clubMemberships && clubMemberships.length > 0 ? (
			clubMemberships.map((clubMembership, index) => (
				<ClubMembershipProvider key={index} clubMembershipData={clubMembership}>
					<ClubBook />
				</ClubMembershipProvider>
			))
		) : (
			<div className="space-y-4 text-center w-full p-x-6">
				<h1 className="text-2xl md:text-4xl">
					welcome to <span className=" font-normal">this</span>
					<span className="font-bold">page</span>!
				</h1>
				<p className="md:text-xl">to get started, create a club or join a club through an invite link.</p>
			</div>
		)
	) : (
		<>
			<ClubBookSkeleton />
			<ClubBookSkeleton />
		</>
	)
}
