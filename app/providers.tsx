// In Next.js, this file would be called: app/providers.jsx
"use client"

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import { ThemeProvider, TooltipProvider } from "@/components/ui"
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from "react-query"

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 10 * 60 * 1000, //10 mins
			},
		},
	})
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return makeQueryClient()
	} else {
		// Browser: make a new query client if we don't already have one
		// This is very important so we don't re-make a new client if React
		// suspends during the initial render. This may not be needed if we
		// have a suspense boundary BELOW the creation of the query client
		if (!browserQueryClient) browserQueryClient = makeQueryClient()
		return browserQueryClient
	}
}

export default function Providers({ children }: { children: React.ReactNode }) {
	// NOTE: Avoid useState when initializing the query client if you don't
	//       have a suspense boundary between this and the code that may
	//       suspend because React will throw away the client on the initial
	//       render if it suspends and there is no boundary
	const queryClient = getQueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider delayDuration={350}>
				<ThemeProvider
					attribute="class"
					disableTransitionOnChange
					defaultTheme="industrial"
					themes={[
						"industrial",
						"supertoy",
						"wireframe",
						"blueprint",
						"sticky-note",
						"old-salt",
						"terminal-orange",
						"terminal-green",
						"dawn",
						"cherry",
						"cyber",
						// "terminal",
						// "kiss",
						// "cherry",
						// "depths",
						// "lilac",
						// "tokyo",
						// "cyber",
						// "mainframe",
						// "dawn",
						// "note",
						// "sky",
					]}
				>
					{children}
				</ThemeProvider>
			</TooltipProvider>
			<Toaster
				offset={84}
				position="top-right"
				duration={2500}
				visibleToasts={1}
				toastOptions={{
					className: "bg-page text-page-foreground border-border",
				}}
				icons={{
					success: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-5 text-emerald-500"
						>
							<path
								fillRule="evenodd"
								d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
								clipRule="evenodd"
							/>
						</svg>
					),
					info: (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
							<path
								fillRule="evenodd"
								d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
								clipRule="evenodd"
							/>
						</svg>
					),
					warning: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-5 text-amber-400"
						>
							<path
								fillRule="evenodd"
								d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
								clipRule="evenodd"
							/>
						</svg>
					),
					error: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-5 text-red-500"
						>
							<path
								fillRule="evenodd"
								d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
								clipRule="evenodd"
							/>
						</svg>
					),
					loading: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-5 animate-spin"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
					),
				}}
			/>
		</QueryClientProvider>
	)
}
