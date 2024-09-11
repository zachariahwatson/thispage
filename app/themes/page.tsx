"use client"

import { ColorPicker, ThemeSpreads } from "@/components/ui/themes"
import { Card } from "@/components/ui"

export default function Page() {
	return (
		<>
			<div className="max-w-sm md:max-w-4xl w-full space-y-3">
				<Card className="h-[calc(100svh-56px)] min-h-[624px] md:h-[624px] p-4 rounded-3xl relative shadow-shadow shadow-sm bg-card">
					<ThemeSpreads />
				</Card>
			</div>
			<ColorPicker name="primary" />
		</>
	)
}
