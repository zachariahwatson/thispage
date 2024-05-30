// import { useEffect, useState } from "react"

// interface Props {
// 	interval:
// }

// export function IntervalButton({ memberId }: Props) {
//     const [interval, setInterval] = useState<ClubType[]>()
//     const [loading, setLoading] = useState<boolean>(true)

//     useEffect(() => {
//         const fetchClubs = async () => {
//             const response = await fetch("http://localhost:3000/api/clubs", {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             })

//             if (!response.ok) {
//                 const body = await response.json()
//                 throw new Error(body.error)
//             }

//             setClubs(await response.json())
//         }
//         fetchClubs().then(() => setLoading(false))
//     }, [])
// 	return <div>Enter</div>
// }
