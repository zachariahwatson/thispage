"use client"

import { ToggleGroup } from "@/components/ui"
import { ThemePollItem } from "@/components/ui/themes"

export function ThemePollItems() {
	const pollData = {
		id: -1,
		created_at: "2024-08-30T09:54:18.723348+00:00",
		club_id: -1,
		end_date: "2024-09-01T05:00:00+00:00",
		is_locked: true,
		name: "next month's theme: sci-fi!",
		description:
			"drop the sci-fi books you've been wanting to read! we'll choose one by next week. nothing from l. ron hubbard guys, you know better.",
		is_finished: false,
		is_archived: false,
		total_votes_count: 17,
		items: [
			{
				id: -1,
				book_title: "Project Hail Mary",
				created_at: "2024-08-30T09:58:46.008377+00:00",
				poll_votes: [],
				votes_count: 8,
				creator_member_id: -1,
				book_authors: ["Andy Weir"],
				book_page_count: 476,
				book_description: `

Ryland Grace is the sole survivor on a desperate, last-chance mission–and if he fails, humanity and the earth itself will perish. Except that right now, he doesn’t know that. He can’t even remember his own name, let alone the nature of his assignment or how to complete it. All he knows is that he’s been asleep for a very, very long time. And he’s just been awakened to find himself millions of miles from home, with nothing but two corpses for company.

His crewmates dead, his memories fuzzily returning, he realizes that an impossible task now confronts him. Alone on this tiny ship that’s been cobbled together by every government and space agency on the planet and hurled into the depths of space, it’s up to him to conquer an extinction-level threat to our species.

And thanks to an unexpected ally, he just might have a chance.

Part scientific mystery, part dazzling interstellar journey, Project Hail Mary is a tale of discovery, speculation, and survival to rival The Martian–while taking us to places it never dreamed of going.
`,
				book_cover_image_url: "https://covers.openlibrary.org/b/id/14567764-L.jpg",
				book_cover_image_width: 331,
				book_cover_image_height: 500,
				percent: 47,
			},
			{
				id: -2,
				book_title: "Childhood's End (Pan 70th Anniversary)",
				created_at: "2024-08-30T10:00:12.411831+00:00",
				poll_votes: [
					{
						id: 111,
						poll_item_id: 33,
					},
				],
				votes_count: 3,
				creator_member_id: -1,
				book_authors: ["Arthur C. Clarke"],
				book_page_count: 272,
				book_description: `Childhood's End is a 1953 science fiction novel by British author Arthur C. Clarke. The story follows the peaceful alien invasion of Earth by the mysterious Overlords, whose arrival ends all war, helps form a world government, and turns the planet into a near-utopia. Many questions are asked about the origins and mission of the aliens, but they avoid answering, preferring to remain in their ships, governing through indirect rule. Decades later, the Overlords eventually show themselves, and their impact on human culture leads to a Golden Age. However, the last generation of children on Earth begin to display powerful psychic abilities, heralding their evolution into a group mind, a transcendent form of life.`,
				book_cover_image_url: "https://covers.openlibrary.org/b/id/8540395-L.jpg",
				book_cover_image_width: 312,
				book_cover_image_height: 500,
				percent: 17,
			},
			{
				id: -3,
				book_title: "Neuromancer",
				created_at: "2024-08-30T10:00:47.891397+00:00",
				poll_votes: [],
				votes_count: 5,
				creator_member_id: -1,
				book_authors: ["William Gibson"],
				book_page_count: 288,
				book_description: `

The first of William Gibson's Sprawl trilogy, Neuromancer is the classic cyberpunk novel. The winner of the Hugo, Nebula, and Philip K. Dick Awards, Neuromancer was the first fully-realized glimpse of humankind’s digital future — a shocking vision that has challenged our assumptions about our technology and ourselves, reinvented the way we speak and think, and forever altered the landscape of our imaginations.

Henry Dorsett Case was the sharpest data-thief in the business, until vengeful former employees crippled his nervous system. But now a new and very mysterious employer recruits him for a last-chance run. The target: an unthinkably powerful artificial intelligence orbiting Earth in service of the sinister Tessier-Ashpool business clan. With a dead man riding shotgun and Molly, mirror-eyed street-samurai, to watch his back, Case embarks on an adventure that ups the ante on an entire genre of fiction.

Hotwired to the leading edges of art and technology, Neuromancer is a cyberpunk, science fiction masterpiece — a classic that ranks with 1984 and Brave New World as one of the twentieth century’s most potent visions of the future.
`,
				book_cover_image_url: "https://covers.openlibrary.org/b/id/13116772-L.jpg",
				book_cover_image_width: 300,
				book_cover_image_height: 450,
				percent: 29,
			},
			{
				id: -4,
				book_title: "I, Robot",
				created_at: "2024-08-30T10:01:29.735393+00:00",
				poll_votes: [],
				votes_count: 1,
				creator_member_id: -1,
				book_authors: ["Isaac Asimov"],
				book_page_count: 192,
				book_description:
					"ROBOPSYCHOLOGIST\r\nDr. Susan Calvin had seen it all when it came to robots. As a girl she had seen the early models -- mute and totally faithful. She joined U.S. Robots and Mechanical Men, Inc. when they began adapting Earth robots for work in space -- and Earth men for work with the strictly logical robots!\r\n\r\nShe had driven the first -- and only -- mind-reading robot out of its mind, and coaxed the childlike Brain to invent the interstellar engine.\r\n\r\nFinally, at the end of her career, she faced the final question: who was really in charge; and who should be?\r\n\r\nIN THESE STORIES OF THE EARLY DAYS OF ROBOTS, ISAAC ASIMOV ESTABLISHED THE THREE LAWS OF ROBOTICS AND DEMONSTRATED THE ABILITIES THAT HAVE MADE HIM ONE OF THE WORLD'S LEADING SCIENCE FICTION WRITERS.\r\n--back cover",
				book_cover_image_url: "https://covers.openlibrary.org/b/id/10491304-L.jpg",
				book_cover_image_width: 295,
				book_cover_image_height: 500,
				percent: 5,
			},
		],
		user_vote_poll_item_id: -2,
		user_has_poll_item: true,
	}

	return (
		<div className="h-full">
			<ToggleGroup type="multiple" className="h-full">
				{/* <ScrollArea className="border rounded-lg min-h-[168px] h-[calc(50svh-176px)] md:h-[456px] shadow-shadow shadow-inner relative"> */}
				<div className="border rounded-lg h-full shadow-shadow shadow-inner relative overflow-y-scroll w-full">
					<div className="p-3 md:p-4 w-auto h-auto space-y-2">
						{pollData?.items &&
							pollData?.items.map((item) => <ThemePollItem key={item.id} item={item} groupValues={["-2", "-4"]} />)}
					</div>
				</div>
				{/* </ScrollArea> */}
			</ToggleGroup>
		</div>
	)
}
