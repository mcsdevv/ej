// import { NextApiRequest, NextApiResponse } from 'next'
// import { chunks } from './common'

// export default (req: NextApiRequest, res: NextApiResponse) => {
//     const {
//         query: { chunkId },
//     } = req

//     try {
//         const index = Number(chunkId)
//         const chunk = chunks[index]

//         console.log(chunks)

//         if (!chunk) {
//             res.status(404)
//         }

//         res.status(200).json(chunk)
//     } catch (e) {
//         res.status(400)
//     }
// }
