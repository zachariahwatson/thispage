import { GeistSans } from "geist/font/sans"
import "@/styles/globals.css"
import Providers from "./providers"
import { Nav } from "@/components/ui"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/buttons"
import { useQuery } from "react-query"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "thispage",
	description: "A simple book club app",
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
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={GeistSans.className}>
			<body className="bg-background text-foreground">
				<Providers>
					<Nav />
					<main className="min-h-[calc(100svh-120px)] flex flex-col items-center pt-6 p-6 md:p-12 md:pt-12 space-y-8">
						{children}
					</main>
					<footer className="flex flex-col justify-center items-center md:text-sm text-xs">
						<div className="h-8">
							© 2024 ❤️ Zachariah Watson |{" "}
							<Button variant="link" className="p-0 text-muted-foreground">
								<Link href="https://github.com/zachariahwatson/thispage">github</Link>
							</Button>{" "}
							|{" "}
							<Button variant="link" className="p-0 text-muted-foreground">
								<Link href="/privacy">privacy</Link>
							</Button>{" "}
							|{" "}
							<Button variant="link" className="p-0 text-muted-foreground">
								<Link href="/terms">terms</Link>
							</Button>{" "}
							|{" "}
							<Button variant="link" className="p-0 text-muted-foreground">
								<Link href="https://github.com/zachariahwatson/thispage/blob/main/CHANGELOG.md">v 0.6.0</Link>
							</Button>{" "}
						</div>
					</footer>
				</Providers>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
