"use client"

import { useState } from "react"
import { Input } from "@/components/ui"

export function ColorPicker({ name }: { name: string }) {
	const [color, setColor] = useState<string | undefined>()

	const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newColor = e.target.value
		setColor(newColor)
		// Update the CSS variable on the fly
		document.documentElement.style.setProperty(`--${name}`, newColor)
	}

	return <Input type="color" className="w-24 h-24" onChange={(e) => handleColorChange(e)} />
}
