import { getChunks, Record } from './common'
import * as R from 'rambda'

describe('homophone endpoint helpers', () => {
    const chunks = getChunks()
    it('chunks', () => {
        const grouped = R.values(
            R.groupBy((record: Record) => record.katakana, chunks[0]),
        )
        expect(grouped.length).toEqual(3)
    })
    it('chunks', () => {
        const first = chunks[0][0]
        expect(Object.keys(first)).toContainEqual('katakana')
        expect(Object.keys(first)).toContainEqual('audioFile')
        expect(Object.keys(first)).toContainEqual('downstep')
    })
})
