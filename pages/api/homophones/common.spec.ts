import { chunks } from './common'
import { Word } from '../utils'
import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'
import * as O from 'fp-ts/lib/Option'

describe('homophone endpoint helpers', () => {
    const flattened: Word[] = A.flatten(chunks)
    it('there are no duplicated audiofiles', () => {
        const grouped = NA.groupBy(
            (record: Word) =>
                (O.toNullable(record.downStep) as any) +
                O.toNullable(record.particle) +
                record.katakana,
        )(flattened)

        const values = A.filter((x: Word[]) => x.length !== 1)(
            Object.values(grouped),
        )
        expect(values).toEqual([])
    })

    it('there are not heiban', () => {
        const values = A.filter((x: Word) => O.isNone(x.downStep))(flattened)
        expect(values).toEqual([])
    })
})
