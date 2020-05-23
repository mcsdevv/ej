import { head, last, initial } from 'lodash'
import { readFileSync } from 'fs-extra'
import { parentDir, normalizeStrings } from './common/wrapper'
// import { getSmallCharacterIndexes } from '../../components/pure/utils/common/wrapper'

import {
    cleanImageFile,
    downsteps,
    cleanKatakana,
    Kana,
    getImageFiles,
} from './img/wrapper'

export interface NHK {
    katakana: string[]
    hiragana: string[]
    jisho: string
    jishoWord: string
    kanji: string[]
    readings: Reading[]
    particleReading: ParticleReading[]
    examples: Example[]
}

interface Reading {
    kana: Kana
    audioFile: string
    downsteps: number[]
}

interface ParticleReading {
    kana: Kana
    audioFile: string
    particle: string
    downsteps: number[]
}

interface Example {
    kana: Kana
    audioFile: string
    downsteps: number[]
    sentence: string
    particle: string | null
}

const cleanAudioFile = (audioFile: string) => {
    const map: Record<string, string> = {
        '４−Ｈクラブ.yomi000BAA8E_007E.wav':
            '４－Ｈクラブ.yomi000BAA8E_007E.wav',
        '４−Ｈクラブ.jyoshi00BAA93_0648.wav':
            '４－Ｈクラブ.jyoshi00BAA93_0648.wav',
    }

    if (audioFile in map) {
        return map[audioFile]
    }
    return audioFile
}

const getDownsteps = (fileList: string[]): number[] => {
    return fileList
        .map((f) => cleanImageFile(f))
        .map((f: string, index: number) => (downsteps.includes(f) ? index : ''))
        .filter(String)
        .map(Number)
}

export const parseNHKObject = (obj: any): NHK | null => {
    if (!obj) {
        return null
    }

    const examples: Example[] = obj.reibun?.map((x: any) => {
        const lastBit = last<string[]>(x)
        const images = getImageFiles(lastBit!)
        const sentence = lastBit!
            .map((x) => {
                if (images.includes(x)) {
                    return cleanKatakana([x]).katakana
                }
                return x
            })
            .join('')
        const kana = cleanKatakana(images)
        const lastPart = last(sentence.split(kana.katakana))!

        if (!lastPart.length) {
            throw new Error('expected after to have at least one character')
        }

        return {
            particle: lastPart ? lastPart[0] : null,
            kana,
            downsteps: getDownsteps(images),
            sentence,
            audioFile: cleanAudioFile(head<string>(x)!),
        }
    })

    const readings: Reading[] = obj.yomi.map((x: any) => {
        const kana = cleanKatakana(last<string[]>(x)!)
        const downsteps = getDownsteps(last<string[]>(x)!)

        return {
            kana: kana,
            downsteps: downsteps,
            audioFile: cleanAudioFile(head<string>(x)!),
        }
    })

    const particleReading: ParticleReading[] = obj.jyoshi
        ?.map((x: any) => {
            const kana = cleanKatakana(initial(last<string[]>(x)))
            const wP = {
                particle: last<string>(last<string>(x))!,
                kana,
                downsteps: getDownsteps(initial(last<string[]>(x))),
                audioFile: cleanAudioFile(head<string>(x)!),
            }

            // For some readson sometimes the particle is multiple charactres
            if (wP.particle.length !== 1) {
                // last(wP.kana)!.special
                if (
                    last(wP.kana.nasal) === wP.kana.katakana.length - 1 ||
                    last(wP.kana.unVoiced) === wP.kana.katakana.length - 1
                ) {
                    if (wP.particle.length !== 2) {
                        throw new Error('expected there to be two characters')
                    }
                    wP.particle = last(wP.particle)!
                } else {
                    return null
                }
            }
            return wP
        })
        .filter((x: ParticleReading | null) => x)

    return {
        jishoWord: obj.jishoWord,
        jisho: obj.jisho,
        kanji: obj.kanji,
        hiragana: obj.kana,
        katakana: obj.katakana,
        readings: readings,
        particleReading: particleReading || [],
        examples: examples || [],
    }
}

export const parseFile = (): NHK[] => {
    return JSON.parse(readFileSync(`${parentDir}/dict.json`).toString())
        .filter((x: any) => x.nhk)
        .map((x: any) => normalizeStrings(x.nhk))
        .map((x: any) => parseNHKObject(x))
        .filter((x: NHK | null) => x)
}

export const getReadingfileName = (r: Reading) =>
    `${r.kana.katakana}|${r.downsteps}|${r.kana.nasal}|${r.kana.unVoiced}.wav`.normalize()

export const getParticleReadingfileName = (r: ParticleReading) =>
    `${r.kana.katakana}|${r.downsteps}|${r.kana.nasal}|${r.kana.unVoiced}|${r.particle}.wav`.normalize()
