import { head, flatMap } from 'lodash'
import {
    parseFile,
    parseNHKObject,
    getReadingfileName,
    getParticleReadingfileName,
} from './utils'

import { getSmallCharacterIndexes } from '../frontend/components/pure/utils/common/wrapper'

import { cleanFiles } from './common/wrapper'
import { readdirSync } from 'fs-extra'

const wordList = parseFile()
const findWordByKanji = (word: string) =>
    wordList.filter((x) => x.kanji.includes(word))

const allReadings = cleanFiles(readdirSync('public/audio/readings'))
const allParticles = cleanFiles(readdirSync('public/audio/particleReadings'))

// TODO check all sentences are accounted for

describe('data pre-processing', () => {
    describe('audio', () => {
        it('checks that all readings are accounted for', () => {
            const parsedReadings = flatMap(
                wordList,
                (x) => x.readings,
            ).map((x) => getReadingfileName(x))

            expect(new Set(parsedReadings.sort())).toEqual(new Set(allReadings))
        })

        it('checks that all particles are accounted for', () => {
            const hasParticle = wordList.filter((x) => x.particleReading)

            const parsedParticles = flatMap(
                hasParticle,
                (x) => x.particleReading,
            ).map((x) => getParticleReadingfileName(x))

            expect(new Set(parsedParticles)).toEqual(new Set(allParticles))
        })

        it('checks that all particles are only 1 character long', () => {
            const hasParticle = wordList.filter((x) => x.particleReading)

            const parsedParticles = flatMap(
                hasParticle,
                (x) => x.particleReading,
            )
                .map((x) => x.particle)
                .filter((x) => x.length !== 1)

            expect(parsedParticles.length).toEqual(0)
        })
    })
})

describe('data processing', () => {
    describe('validation', () => {
        it('it return null if given null', () => {
            expect(parseNHKObject(null)).toBeNull()
        })

        it('it should not contain any undefined', () => {
            const particleReadings = flatMap(wordList, (x) => x.particleReading)

            expect(
                particleReadings.filter((x) => x === undefined).length,
            ).toEqual(0)
        })

        it('all particles should have a length of 1', () => {
            const particleReadings = flatMap(
                wordList.filter((x) => x.particleReading.length > 0),
                (x) => x.particleReading,
            ).filter((pr) => pr.particle.length !== 1)
            expect(particleReadings).toEqual([])
        })

        it('gets all the example sentences', () => {
            const examples = flatMap(
                wordList.filter((x) => x.examples.length > 0),
                (x) => x.examples,
            )

            const notIncluded = examples.filter(
                (x) => !x.sentence.includes(x.kana.katakana),
            )

            expect(notIncluded.length).toEqual(0)

            expect(examples[1].sentence).toEqual(
                '夜になって、イイホう告が届いた',
            )
        })

        it('checks if there is another word stuck on instead of a particle', () => {
            const regex = /\（([^)]+)\）/

            const examples = wordList
                .filter((x) => x.examples.length > 0)
                .filter((x) => regex.exec(x.jisho))
                .map((x) => ({
                    r: regex.exec(x.jisho),
                    e: x.examples,
                }))

            expect(
                wordList.find(
                    (x) =>
                        x.jisho === '琴しつ｛瑟｝（〜相和す）' &&
                        x.examples.length,
                ),
            ).toBeFalsy()
        })

        describe('correctness', () => {
            it('there shouldnt be a word that has a downstep on a little character and on the one before it', () => {
                const bad = wordList.filter((x) => {
                    const smallDownsteps = x.readings.find((reading) => {
                        const smallIndexes = getSmallCharacterIndexes(
                            reading.kana.katakana,
                        )
                        return smallIndexes.includes(reading.downsteps[0])
                    })

                    const prevSmallDownsteps = x.readings.find((reading) => {
                        const previndexes = getSmallCharacterIndexes(
                            reading.kana.katakana,
                        ).map((i) => i - 1)
                        return previndexes.includes(reading.downsteps[0])
                    })

                    return smallDownsteps && prevSmallDownsteps
                })

                expect(bad.length).toEqual(0)
            })

            it('hozono', () => {
                const parsed = head(findWordByKanji('ほぞの緒')).readings
                expect(parsed[1].downsteps).toEqual([0, 4])
            })

            it('daigaku', () => {
                const parsed = head(head(findWordByKanji('大学')).readings)
                expect(parsed.downsteps).toEqual([])
            })

            it('imouto', () => {
                const parsed = head(head(findWordByKanji('妹')).readings)
                expect(parsed.downsteps).toEqual([3])
            })

            it('busaiku', () => {
                const parsed = head(head(findWordByKanji('不細工')).readings)
                expect(parsed.downsteps).toEqual([1])
            })
            it('hashi - bridge', () => {
                const parsed = head(head(findWordByKanji('橋')).readings)
                expect(parsed.downsteps).toEqual([1])
            })
            it('hashi - chopsticks', () => {
                const parsed = head(head(findWordByKanji('箸')).readings)
                expect(parsed.downsteps).toEqual([0])
            })

            it('hashi - edge', () => {
                const word = head(findWordByKanji('端'))
                expect(word.readings[2]).toEqual({
                    audioFile: '端.yomi00094E05_0116.wav',
                    downsteps: [],
                    kana: {
                        katakana: 'ハシ',
                        nasal: [],
                        unVoiced: [],
                    },
                })
            })
        })
    })
})
