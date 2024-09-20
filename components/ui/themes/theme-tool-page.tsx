"use client"

import { ColorPicker, ThemeSpreads } from "@/components/ui/themes"
import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { FirstLoadAnimationProvider } from "@/contexts"
import { Button } from "@/components/ui/buttons"
import { toast } from "sonner"

export function ThemeToolPage() {
	const [radius, setRadius] = useState(0)
	const [cssVars, setCssVars] = useState("")

	const names = [
		"background",
		"background-dark",
		"foreground",
		"book",
		"book-border",
		"page",
		"page-fold",
		"page-foreground",
		"card",
		"card-foreground",
		"popover",
		"popover-foreground",
		"primary",
		"primary-foreground",
		"secondary",
		"secondary-foreground",
		"accent",
		"accent-foreground",
		"muted",
		"muted-foreground",
		"destructive",
		"destructive-foreground",
		"shadow",
		"shadow-dark",
		"border",
		"input",
		"ring",
		"radius",
	]

	// Generate the CSS variables code block
	const generateCssVars = () => {
		const cssCode = names
			.map((name) => `--${name}: ${getComputedStyle(document.documentElement).getPropertyValue(`--${name}`)};`)
			.join("\n")
		setCssVars(cssCode)
	}

	const handleRadiusChange = (value: number[]) => {
		const newRadius = value[0]
		setRadius(newRadius)
		document.documentElement.style.setProperty("--radius", `${newRadius}rem`)
	}

	useEffect(() => {
		// Get the current --radius value from the root element
		const currentRadius = getComputedStyle(document.documentElement).getPropertyValue("--radius").trim()

		// Set the initial state with the current --radius value, default to 0 if undefined
		setRadius(parseFloat(currentRadius) || 0)

		// Generate the CSS variables when the component mounts
		generateCssVars()
	}, [])
	return (
		<FirstLoadAnimationProvider key="themes">
			<div className="max-w-sm md:max-w-4xl w-full space-y-3">
				<h1 className="font-bold text-lg md:text-3xl pl-1 truncate ... pr-16 font-epilogue">theme tool</h1>
				<ThemeSpreads />
			</div>
			<div className="flex flex-col md:flex-row space-y-2 md:space-x-4 md:space-y-0 p-2 mt-0">
				<div className="flex flex-row flex-wrap bg-white rounded-md p-2 md:p-4 shadow-lg max-w-5xl justify-center">
					<ColorPicker name="background">
						<ColorPicker name="background-dark" />
						<ColorPicker name="foreground" />
					</ColorPicker>

					<ColorPicker name="book">
						<ColorPicker name="book-border" />
					</ColorPicker>

					<ColorPicker name="page">
						<ColorPicker name="page-fold" />
						<ColorPicker name="page-foreground" />
					</ColorPicker>

					<ColorPicker name="card">
						<ColorPicker name="card-foreground" />
					</ColorPicker>

					<ColorPicker name="popover">
						<ColorPicker name="popover-foreground" />
					</ColorPicker>

					<ColorPicker name="primary">
						<ColorPicker name="primary-foreground" />
					</ColorPicker>

					<ColorPicker name="secondary">
						<ColorPicker name="secondary-foreground" />
					</ColorPicker>

					<ColorPicker name="accent">
						<ColorPicker name="accent-foreground" />
					</ColorPicker>

					<ColorPicker name="muted">
						<ColorPicker name="muted-foreground" />
					</ColorPicker>

					<ColorPicker name="destructive">
						<ColorPicker name="destructive-foreground" />
					</ColorPicker>

					<ColorPicker name="shadow">
						<ColorPicker name="shadow-dark" />
					</ColorPicker>

					<ColorPicker name="border" />
					<ColorPicker name="input" />
					<ColorPicker name="ring" />
					<div className="w-full max-w-xs">
						<label htmlFor="radius-slider" className="block mb-2 font-medium text-gray-700">
							Border Radius
						</label>
						<Slider
							id="radius-slider"
							min={0}
							max={1}
							step={0.25}
							value={[radius]}
							onValueChange={handleRadiusChange}
							className="mt-2"
						/>
						<p className="text-gray-500 mt-1">Current Radius: {radius}rem</p>
					</div>
				</div>
				<div className="p-2 md:p-4 bg-white rounded-md shadow-lg min-w-[344px]">
					<pre className="p-2 rounded text-sm whitespace-pre-wrap">{cssVars}</pre>
					<Button
						variant="outline"
						onClick={() => {
							navigator.clipboard.writeText(cssVars)
							toast.success("text copied!")
						}}
						className="p-2 w-full"
					>
						copy text
					</Button>
				</div>
			</div>
		</FirstLoadAnimationProvider>
	)
}
