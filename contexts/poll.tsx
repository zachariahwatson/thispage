"use client"

import { Poll } from "@/lib/types"
import { createContext, useContext } from "react"

interface Props {
	children: React.ReactNode
	pollData: Poll
}

const PollContext = createContext<Poll | null>(null)

const PollProvider = ({ children, pollData }: Props) => {
	return <PollContext.Provider value={pollData}>{children}</PollContext.Provider>
}

const usePoll = () => {
	return useContext(PollContext)
}

export { PollProvider, usePoll }
