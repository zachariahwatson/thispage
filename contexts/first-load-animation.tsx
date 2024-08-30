"use client"

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react"

interface Props {
	children: React.ReactNode
}

const FirstLoadAnimationContext = createContext<{
	firstLoad: boolean
	setFirstLoad: Dispatch<SetStateAction<boolean>>
} | null>(null)

const FirstLoadAnimationProvider = ({ children }: Props) => {
	const [firstLoad, setFirstLoad] = useState<boolean>(false)
	return (
		<FirstLoadAnimationContext.Provider value={{ firstLoad, setFirstLoad }}>
			{children}
		</FirstLoadAnimationContext.Provider>
	)
}

const useFirstLoadAnimation = () => {
	return useContext(FirstLoadAnimationContext)
}

export { FirstLoadAnimationProvider, useFirstLoadAnimation }
