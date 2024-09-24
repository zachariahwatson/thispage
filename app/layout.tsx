import { Button } from "@/components/ui/buttons"
import { Nav } from "@/components/ui/nav"
import "@/styles/globals.css"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Metadata, Viewport } from "next"
import Link from "next/link"
import Providers from "./providers"
import { version } from "@/lib/version"
import localFont from "next/font/local"
import TempThemeWrapper from "./temp-theme-wrapper"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: "thispage",
	description: "a simple book club site",
	applicationName: "thispage",
	keywords: [
		"thispage",
		"book club",
		"book club site",
		"book club app",
		"online book clubs",
		"book discussions",
		"book readings",
		"reading goals",
		"book comments",
		"book posts",
		"book club polls",
		"reading progress tracking",
		"page tracking",
		"section tracking",
		"incremental reading goals",
		"goal completion",
		"book club community",
		"collaborative reading",
		"discussion posts",
		"reading polls",
		"book discussions online",
		"group reading goals",
	],
	creator: "Zachariah Watson",
	icons: {
		icon: [
			{ rel: "icon", sizes: "16x16", url: "/images/favicon-16x16.png" },
			{ rel: "icon", sizes: "32x32", url: "/images/favicon-32x32.png" },
		],
		other: [
			{ rel: "apple-touch-icon", sizes: "180x180", url: "/images/apple-touch-icon.png" },
			{ rel: "icon", sizes: "192x192", url: "/images/android-chrome-192x192.png" },
			{ rel: "icon", sizes: "512x512", url: "/images/android-chrome-512x512.png" },
		],
	},
	openGraph: {
		title: "thispage",
		description: "a simple book club site",
		url: "https://thispa.ge",
		siteName: "thispage",
		locale: "en_US",
		type: "website",
		// images: [
		// 	{
		// 		url: "https://thispa.ge/images/twitter-img.png",
		// 		width: 512,
		// 		height: 512,
		// 		alt: "a gray book with a red bookmark in it",
		// 	},
		// ],
	},
	twitter: {
		card: "summary",
		title: "thispage",
		description: "a simple book club site",
		creator: "@zchwtsn",
		creatorId: "1365452328501927936",
		// images: [
		// 	{
		// 		url: "https://thispa.ge/images/twitter-img.png",
		// 		width: 512,
		// 		height: 512,
		// 		alt: "a gray book with a red bookmark in it",
		// 	},
		// ],
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
		{ path: "./../public/fonts/epilogue/Epilogue-Variable.ttf", style: "normal" },
		{ path: "./../public/fonts/epilogue/Epilogue-Variable.woff", style: "normal" },
		{ path: "./../public/fonts/epilogue/Epilogue-Variable.woff2", style: "normal" },
		{ path: "./../public/fonts/epilogue/Epilogue-VariableItalic.ttf", style: "italic" },
		{ path: "./../public/fonts/epilogue/Epilogue-VariableItalic.woff", style: "italic" },
		{ path: "./../public/fonts/epilogue/Epilogue-VariableItalic.woff2", style: "italic" },
	],
	weight: "100 900",
	display: "swap",
})

const PlusJakartaSans = localFont({
	variable: "--font-plus-jakarta-sans",
	src: [
		{ path: "./../public/fonts/plus-jakarta-sans/PlusJakartaSans-Variable.ttf", style: "normal" },
		{ path: "./../public/fonts/plus-jakarta-sans/PlusJakartaSans-Variable.woff", style: "normal" },
		{ path: "./../public/fonts/plus-jakarta-sans/PlusJakartaSans-Variable.woff2", style: "normal" },
		{ path: "./../public/fonts/plus-jakarta-sans/PlusJakartaSans-VariableItalic.ttf", style: "italic" },
		{ path: "./../public/fonts/plus-jakarta-sans/PlusJakartaSans-VariableItalic.woff", style: "italic" },
		{ path: "./../public/fonts/plus-jakarta-sans/PlusJakartaSans-VariableItalic.woff2", style: "italic" },
	],
	weight: "200 800",
	display: "swap",
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${PlusJakartaSans.variable} ${Epilogue.variable} h-full`} suppressHydrationWarning>
			<body className="font-plus-jakarta-sans h-full">
				<Providers>
					<TempThemeWrapper>
						<Nav />
						<main className="min-h-[calc(100svh-120px)] flex flex-col items-center pt-6 p-2 md:p-12 md:pt-12 space-y-12 pb-12">
							{children}
						</main>
						<footer className="flex flex-col md:flex-row justify-center items-center md:text-sm text-xs mb-4 px-2">
							<span>© 2024 ❤️ Zachariah Watson </span>
							<div>
								<span className="ml-1">
									<span className="hidden md:inline">|</span>{" "}
									<Button variant="link" className="p-0 text-muted-foreground h-5">
										<Link href="https://github.com/zachariahwatson/thispage" target="_blank" rel="noopener noreferrer">
											github
										</Link>
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
										<Link href="/privacy">privacy</Link>
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
					</TempThemeWrapper>
				</Providers>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
