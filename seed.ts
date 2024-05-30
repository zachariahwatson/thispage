/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed"

const main = async () => {
	const seed = await createSeedClient({ dryRun: true, connect: true })

	// Truncate all tables in the database
	await seed.$resetDatabase(["!public.club_permissions"])

	await seed.books([
		{
			open_library_id: "OL7950145M",
			title: "Dangerous Visions",
			description: null,
			authors: ["Harlan Ellison"],
			page_count: 592,
			cover_image_url: "https://covers.openlibrary.org/b/id/477258-M.jpg",
			cover_image_width: 180,
			cover_image_height: 268,
		},
		{
			open_library_id: "OL9655772M",
			title: `Childhood's End`,
			description: `Childhood's End is a 1953 science fiction novel by British author Arthur C. Clarke. The story follows the peaceful alien invasion of Earth by the mysterious Overlords, whose arrival ends all war, helps form a world government, and turns the planet into a near-utopia. Many questions are asked about the origins and mission of the aliens, but they avoid answering, preferring to remain in their ships, governing through indirect rule. Decades later, the Overlords eventually show themselves, and their impact on human culture leads to a Golden Age. However, the last generation of children on Earth begin to display powerful psychic abilities, heralding their evolution into a group mind, a transcendent form of life. `,
			authors: ["Arthur C. Clarke"],
			page_count: 224,
			cover_image_url: "https://covers.openlibrary.org/b/id/207485-M.jpg",
			cover_image_width: 180,
			cover_image_height: 302,
		},
		{
			open_library_id: "OL25440979M",
			title: "Discourses, Fragments, Handbook",
			description: null,
			authors: ["Epictetus"],
			page_count: 390,
			cover_image_url: "https://covers.openlibrary.org/b/id/7275050-M.jpg",
			cover_image_width: 180,
			cover_image_height: 274,
		},
		{
			open_library_id: "OL24211309M",
			title: "JEM",
			description: `The discovery of another habitable world might spell salvation to the three (Food Bloc, Fuel Bloc & People Bloc) bitterly competing power blocs of the war torn & resource-starved 21st century. But when their representatives arrive on Jem, with its three intelligent species, they discover instead the perfect situation into which to export their rivalries. Subtitled, with savage irony, 'The Making of a Utopia', Jem is one of Frederik Pohl's most powerful novels.`,
			authors: ["Frederik Pohl"],
			page_count: 314,
			cover_image_url: "https://covers.openlibrary.org/b/id/6522059-M.jpg",
			cover_image_width: 180,
			cover_image_height: 274,
		},
		{
			open_library_id: "OL5725664M",
			title: "Letters from a Stoic",
			description: null,
			authors: ["Seneca the Younger"],
			page_count: 254,
			cover_image_url: "https://covers.openlibrary.org/b/id/103759-M.jpg",
			cover_image_width: 180,
			cover_image_height: 275,
		},
	])

	const { clubs } = await seed.clubs((x) =>
		x(2, {
			readings: (x) =>
				x({ min: 2, max: 5 }, (ctx) => ({
					start_date: Math.random() < 0.5 ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) : new Date(Date.now()),
					join_in_progress: Math.random() < 0.5,
				})),
		})
	)

	await seed.club_invite_codes((x) => x(5))

	const { members } = await seed.members((x) => x({ min: 25, max: 50 }))

	await seed.intervals((x) =>
		x(10, (ctx) => ({
			goal_page: Math.floor(Math.random() * 100),
		}))
	)

	await seed.member_interval_progresses((x) =>
		x(members.length, (ctx) => ({
			is_complete: Math.random() < 0.5,
		}))
	)

	await seed.posts((x) => x(25))

	await seed.comments((x) => x({ min: 25, max: 50 }))

	await seed.likes((x) => x({ min: 50, max: 100 }))

	process.exit()
}

main()
