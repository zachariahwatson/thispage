"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui"
import { HexColorPicker, HexColorInput } from "react-colorful"

export function ColorPicker({ name, children }: { name: string; children?: React.ReactNode }) {
	const [color, setColor] = useState<string | undefined>()
	const [visible, setVisible] = useState<boolean>(false)

	// Utility to convert HSL to Hex (for setting the color picker input)
	const hslToHex = (h: number, s: number, l: number): string => {
		s /= 100
		l /= 100
		const k = (n: number) => (n + h / 30) % 12
		const a = s * Math.min(l, 1 - l)
		const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))))

		return `#${[f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, "0")).join("")}`
	}

	// Convert hex color to HSL
	const hexToHsl = (hex: string): string => {
		let r = 0,
			g = 0,
			b = 0
		if (hex.length === 4) {
			r = parseInt(hex[1] + hex[1], 16)
			g = parseInt(hex[2] + hex[2], 16)
			b = parseInt(hex[3] + hex[3], 16)
		} else if (hex.length === 7) {
			r = parseInt(hex[1] + hex[2], 16)
			g = parseInt(hex[3] + hex[4], 16)
			b = parseInt(hex[5] + hex[6], 16)
		}
		r /= 255
		g /= 255
		b /= 255
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b)
		let h = 0,
			s = 0,
			l = (max + min) / 2

		if (max !== min) {
			const d = max - min
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0)
					break
				case g:
					h = (b - r) / d + 2
					break
				case b:
					h = (r - g) / d + 4
					break
				default:
					h = 0
			}
			h /= 6
		}

		return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
	}

	// Retrieve the initial value of the CSS variable from :root
	useEffect(() => {
		const rootStyles = getComputedStyle(document.documentElement)
		const initialHSL = rootStyles.getPropertyValue(`--${name}`).trim()
		if (initialHSL) {
			const hslParts = initialHSL.split(" ")
			const h = parseFloat(hslParts[0])
			const s = parseFloat(hslParts[1].replace("%", ""))
			const l = parseFloat(hslParts[2].replace("%", ""))
			const initialHex = hslToHex(h, s, l)
			setColor(initialHex)
		}
	}, [name])

	const handleColorChange = (color: string) => {
		setColor(color)
		// Update the CSS variable on the fly
		document.documentElement.style.setProperty(`--${name}`, hexToHsl(color))
	}

	return (
		<div
			className="flex flex-row relative justify-center items-center p-2 md:p-4 rounded-md m-1 md:m-2"
			style={{ backgroundColor: color }}
		>
			<PopoverPicker color={color} onChange={handleColorChange} name={name} />
			{children}
		</div>
	)
}

const PopoverPicker = ({ color, onChange, name }: { color: any; onChange: any; name: string }) => {
	const popover = useRef<HTMLDivElement | null>(null)
	const [isOpen, toggle] = useState(false)

	const close = useCallback(() => toggle(false), [])
	useClickOutside(popover, close)

	return (
		<div
			className="relative flex justify-center items-center w-full h-full cursor-pointer"
			onClick={() => toggle(true)}
		>
			<div className="size-12 w-14 md:size-24 rounded-md" style={{ backgroundColor: color }} />
			<div className="absolute flex justify-center flex-col items-center md:text-lg text-xs">
				<p className="text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] shadow-black">{name}</p>
				<p className="text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] shadow-black">{color}</p>
			</div>

			{isOpen && (
				<div className="absolute z-10 p-2 bg-white rounded-md shadow-md top-full" ref={popover}>
					<HexColorPicker color={color} onChange={onChange} />
					<HexColorInput color={color} onChange={onChange} className="bg-white w-24 text-black" />
				</div>
			)}
		</div>
	)
}

// Improved version of https://usehooks.com/useOnClickOutside/
const useClickOutside = (ref: any, handler: any) => {
	useEffect(() => {
		let startedInside = false
		let startedWhenMounted = false

		const listener = (event: any) => {
			// Do nothing if `mousedown` or `touchstart` started inside ref element
			if (startedInside || !startedWhenMounted) return
			// Do nothing if clicking ref's element or descendent elements
			if (!ref.current || ref.current.contains(event.target)) return

			handler(event)
		}

		const validateEventStart = (event: any) => {
			startedWhenMounted = ref.current
			startedInside = ref.current && ref.current.contains(event.target)
		}

		document.addEventListener("mousedown", validateEventStart)
		document.addEventListener("touchstart", validateEventStart)
		document.addEventListener("click", listener)

		return () => {
			document.removeEventListener("mousedown", validateEventStart)
			document.removeEventListener("touchstart", validateEventStart)
			document.removeEventListener("click", listener)
		}
	}, [ref, handler])
}
