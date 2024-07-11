"use client"

import { ClubMembership } from "@/lib/types"
import { createContext, useContext } from "react"

interface Props {
	children: React.ReactNode
	clubMembershipData: ClubMembership
}

const ClubMembershipContext = createContext<ClubMembership | null>(null)

const ClubMembershipProvider = ({ children, clubMembershipData }: Props) => {
	return <ClubMembershipContext.Provider value={clubMembershipData}>{children}</ClubMembershipContext.Provider>
}

const useClubMembership = () => {
	return useContext(ClubMembershipContext)
}

export { ClubMembershipProvider, useClubMembership }
