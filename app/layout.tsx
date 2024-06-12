import { GeistSans } from "geist/font/sans"
import "@/styles/globals.css"
import Providers from "./providers"
import { Nav } from "@/components/ui"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/buttons"
import { useQuery } from "react-query"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
	: "http://localhost:3000"

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "thispage",
	description: "A simple book club app",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={GeistSans.className}>
			<body className="bg-background text-foreground">
				<Providers>
					<Nav />
					<main className="min-h-[calc(100vh-120px)] flex flex-col items-center pt-6 p-6 md:p-12 md:pt-12 space-y-8">
						{children}
					</main>
					<footer className="flex justify-center items-center h-12 md:text-sm text-xs">
						<div>
							© 2024 ❤️ Zachariah Watson |{" "}
							<Button variant="link" className="p-0 text-muted-foreground">
								<Link href="https://github.com/zachariahwatson/thispage">github</Link>
							</Button>
						</div>
					</footer>
				</Providers>
			</body>
		</html>
	)
}
