import { chunks, Word } from './common'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'

describe('homophone endpoint helpers', () => {
    const flattened: Word[] = A.flatten(chunks)
    it('there are no duplicated audiofiles', () => {
        const grouped = NA.groupBy(
            (record: Word) => record.downStep + record.katakana,
        )(flattened)

        const values = A.filter((x: Word[]) => x.length !== 1)(
            Object.values(grouped),
        )
        expect(values).toEqual([])
    })

    it('there are not heiban', () => {
        const values = A.filter((x: Word) => x.downStep === null)(flattened)
        expect(values).toEqual([])
    })
})
