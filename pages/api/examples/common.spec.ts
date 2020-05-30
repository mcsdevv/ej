import { chunks, Example } from './common'

import * as A from 'fp-ts/lib/Array'
import * as NA from 'fp-ts/lib/NonEmptyArray'
import { pipe } from 'fp-ts/lib/pipeable'
import * as O from 'fp-ts/lib/Option'

describe('example endpoint helpers', () => {
    it('there are no duplicated audiofiles', () => {
        pipe(
            NA.groupBy(
                (x: Example) =>
                    (O.toNullable(x.downStep) as any) +
                    O.toNullable(x.particle) +
                    x.katakana +
                    x.sentence,
            )(A.flatten(chunks)),
            (grouped) => Object.values(grouped),
            A.filter((group) => group.length > 1),
        )
    })
})
