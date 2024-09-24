"use client"

import { useTempTheme } from "@/contexts"

export default function TempThemeWrapper({ children }: { children: React.ReactNode }) {
	const { tempTheme } = useTempTheme()

	return <div className={`${tempTheme} bg-background text-foreground`}>{children}</div>
}
