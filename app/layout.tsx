import { Button } from "@/components/ui/buttons"
import { Nav } from "@/components/ui/nav"
import "@/styles/globals.css"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import Link from "next/link"
import Providers from "./providers"
import { version } from "@/lib/version"
import localFont from "next/font/local"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: "thispage",
	description: "a simple book club app",
	icons: {
		icon: [
			{ rel: "icon", sizes: "16x16", url: "/favicon-16x16.png" },
			{ rel: "icon", sizes: "32x32", url: "/favicon-32x32.png" },
		],
		other: [
			{ rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
			{ rel: "icon", sizes: "192x192", url: "/android-chrome-192x192.png" },
			{ rel: "icon", sizes: "512x512", url: "/android-chrome-512x512.png" },
		],
	},
	openGraph: {
		title: "thispage",
		description: "a simple book club app",
	},
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
}

const Epilogue = localFont({
	variable: "--font-epilogue",
	src: [
		{ path: "./../public/fonts/Epilogue-Variable.ttf", style: "normal" },
		{ path: "./../public/fonts/Epilogue-VariableItalic.ttf", style: "italic" },
	],
})

const PlusJakartaSans = localFont({
	variable: "--font-plus-jakarta-sans",
	src: [
		{ path: "./../public/fonts/PlusJakartaSans-Variable.ttf", style: "normal" },
		{ path: "./../public/fonts/PlusJakartaSans-VariableItalic.ttf", style: "italic" },
	],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${PlusJakartaSans.variable} ${Epilogue.variable} h-full`}>
			<body className="bg-background text-foreground font-plus-jakarta-sans h-full">
				<Providers>
					<Nav />
					<main className="min-h-[calc(100svh-120px)] flex flex-col items-center pt-6 p-2 md:p-12 md:pt-12 space-y-12 pb-12">
						{children}
					</main>
					<footer className="flex flex-col flex-wrap justify-end items-center md:text-sm text-xs mb-4 px-2">
						<div>
							© 2024 ❤️ Zachariah Watson{" "}
							<span>
								|{" "}
								<Button variant="link" className="p-0 text-muted-foreground h-5">
									<Link href="https://github.com/zachariahwatson/thispage" target="_blank" rel="noopener noreferrer">
										github
									</Link>
								</Button>{" "}
							</span>
							<span>
								|{" "}
								<Button variant="link" className="p-0 text-muted-foreground h-5">
									<Link href="/privacy">privacy</Link>
								</Button>{" "}
							</span>
							<span>
								|{" "}
								<Button variant="link" className="p-0 text-muted-foreground h-5">
									<Link href="/terms">terms</Link>
								</Button>{" "}
							</span>
							<span>
								|{" "}
								<Button variant="link" className="p-0 text-muted-foreground h-5">
									<Link
										href="https://github.com/zachariahwatson/thispage/blob/main/CHANGELOG.md"
										target="_blank"
										rel="noopener noreferrer"
									>
										v {version}
									</Link>
								</Button>{" "}
							</span>
						</div>
					</footer>
				</Providers>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
