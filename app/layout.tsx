import { GeistSans } from "geist/font/sans"
import "@/styles/globals.css"
import Providers from "./providers"

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "thispage",
	description: "A simple book club app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<Providers>
			<html lang="en" className={GeistSans.className}>
				<body className="bg-background text-foreground">
					<main className="min-h-screen flex flex-col items-center pt-6 p-12 pb-24 md:pt-12 space-y-8">{children}</main>
				</body>
			</html>
		</Providers>
	)
}
