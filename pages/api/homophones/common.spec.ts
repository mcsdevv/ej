import { chunks, Record } from './common'
import * as R from 'rambda'

describe('homophone endpoint helpers', () => {
    const flattened = R.flatten(chunks)
    it('there are no duplicated audiofiles', () => {
        const grouped = R.groupBy(
            (record: Record) => record.downstep + record.katakana,
            flattened,
        )

        const values = R.filter((x) => x.length !== 1, grouped)

        expect(values).toEqual({})
    })
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
