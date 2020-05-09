import { readdirSync } from 'fs-extra'
import { imgDir, kanaDir, cleanFiles } from '../common/wrapper'

export type Kana = {
    katakana: string
    unVoiced: number[]
    nasal: number[]
}

const nasalSound = 'p'
const unVoicedSound = 'c'
export const specials = [nasalSound, unVoicedSound]

export const parseDirty = (dirty: string): Kana => {
    const clean = dirty
        .split('')
        .filter((char) => !specials.includes(char))
        .join('')

    const sIndexes = dirty
        .split('')
        .map((char, i) => ({ s: char, index: i }))
        .filter(({ s }) => specials.includes(s))

    const kanaIndexes = sIndexes.map(({ s, index }, i) => ({
        s,
        index: index - i,
    }))

    const unVoiced = kanaIndexes
        .filter(({ s }) => s === unVoicedSound)
        .map(({ index }) => index)
    const nasal = kanaIndexes
        .filter(({ s }) => s === nasalSound)
        .map(({ index }) => index)

    return {
        katakana: clean,
        unVoiced: unVoiced,
        nasal: nasal,
    }
}

export const processImages = () => {
    const dirs = cleanFiles(readdirSync(kanaDir))
    const map: Record<string, string[]> = {}
    dirs.forEach((dirname) => {
        map[dirname.normalize()] = cleanFiles(
            readdirSync(`${kanaDir}/${dirname}`),
        )
    })
    return map
}

const getimgToKatakana = () => {
    const kana2img = processImages()
    const map: Record<string, string> = {}
    Object.keys(kana2img).forEach((kana) => {
        kana2img[kana].forEach((image) => {
            map[image] = kana
        })
    })
    return map
}

export const img2katakana = getimgToKatakana()

export const cleanImageFile = (filename: string) => {
    const keys = Object.keys(img2katakana)
    const includedFile = keys.find((k) => filename.includes(k))

    if (!includedFile) {
        throw new Error(`Unrecognised image ${filename}`)
    }

    return includedFile
}

export const getKatakana = (fileList: string[]) =>
    fileList.map((f) => img2katakana[cleanImageFile(f)]).join('')

export const cleanKatakana = (fileList: string[]) =>
    parseDirty(getKatakana(fileList))

export const downsteps = cleanFiles(readdirSync(`${imgDir}/downsteps`))
