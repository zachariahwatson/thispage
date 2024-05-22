import { GeistSans } from "geist/font/sans"
import "@/styles/globals.css"
import Providers from "./providers"
import { Nav } from "@/components/ui"
import { createClient } from "@/utils/supabase/server"

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "thispage",
	description: "A simple book club app",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	return (
		<Providers>
			<html lang="en" className={GeistSans.className}>
				<body className="bg-background text-foreground">
					<Nav user={user} />
					<main className="min-h-[calc(100vh-120px)] flex flex-col items-center pt-6 p-12 md:pt-12 space-y-8">
						{children}
					</main>
					<footer className="flex justify-center items-center h-12">
						<div>© 2024 ❤️ Zachariah Watson</div>
					</footer>
				</body>
			</html>
		</Providers>
	)
}
