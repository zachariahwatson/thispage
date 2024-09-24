"use client"

import { Dispatch, SetStateAction, createContext, useContext, useState } from "react"

interface Props {
	children: React.ReactNode
}

const TempThemeContext = createContext<{
	tempTheme: string
	setTempTheme: Dispatch<SetStateAction<string>>
} | null>(null)

const TempThemeProvider = ({ children }: Props) => {
	const [tempTheme, setTempTheme] = useState<string>("")
	return <TempThemeContext.Provider value={{ tempTheme, setTempTheme }}>{children}</TempThemeContext.Provider>
}

const useTempTheme = () => {
	const context = useContext(TempThemeContext)
	return context ? context : { tempTheme: "", setTempTheme: () => {} }
}

export { TempThemeProvider, useTempTheme }
