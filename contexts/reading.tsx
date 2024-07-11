"use client"

import { Reading } from "@/lib/types"
import { createContext, useContext } from "react"

interface Props {
	children: React.ReactNode
	readingData: Reading
}

const ReadingContext = createContext<Reading | null>(null)

const ReadingProvider = ({ children, readingData }: Props) => {
	return <ReadingContext.Provider value={readingData}>{children}</ReadingContext.Provider>
}

const useReading = () => {
	return useContext(ReadingContext)
}

export { ReadingProvider, useReading }
