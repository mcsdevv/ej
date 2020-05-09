import { flatten } from 'lodash'
import { cleanFiles, imgDir } from '../common/wrapper'
import { processImages, img2katakana, downsteps, parseDirty } from './img'
import { readdirSync } from 'fs-extra'

const allImg = cleanFiles(readdirSync(`${imgDir}/all`)).sort()
const notDownsteps = cleanFiles(readdirSync(`${imgDir}/notDownsteps`)).sort()

describe('data pre-processing', () => {
    describe('images', () => {
        it('tests that the images have been sorted into the correct directories', () => {
            const map = processImages()
            expect(map['・'].length).toBe(1)
            expect(map['ゥ'].length).toBe(1)
            expect(map['ッ'].length).toBe(2)
            Object.keys(map)
                .filter((x) => x !== '・' && x !== 'ゥ' && x !== 'ッ')
                .forEach((x) => {
                    expect(map[x].length).toBe(3)
                })

            expect(allImg).toEqual(flatten(Object.values(map)).sort())
        })

        it('should produce a map of image to katakana', () => {
            expect(allImg).toEqual(flatten(Object.keys(img2katakana)).sort())
        })

        it('checks if all downsteps and non downsteps have been accounted for', () => {
            expect(allImg).toEqual(notDownsteps.concat(downsteps).sort())
        })

        it('parseskana p', () => {
            expect(parseDirty('シpゴト')).toEqual({
                katakana: 'シゴト',
                nasal: [1],
                unVoiced: [],
            })
        })
        it('parseskana c', () => {
            expect(parseDirty('シcゴト')).toEqual({
                katakana: 'シゴト',
                nasal: [],
                unVoiced: [1],
            })
        })

        it('parseskana both', () => {
            expect(parseDirty('シcゴpト')).toEqual({
                katakana: 'シゴト',
                nasal: [2],
                unVoiced: [1],
            })
        })
        it('parses kana multiple', () => {
            expect(parseDirty('cツキcシタpガウ')).toEqual({
                katakana: 'ツキシタガウ',
                nasal: [4],
                unVoiced: [0, 2],
            })
        })

        it('parses kana multiple', () => {
            expect(parseDirty('ホーpガcクチpガイ')).toEqual({
                katakana: 'ホーガクチガイ',
                nasal: [2, 5],
                unVoiced: [3],
            })
        })
    })
})
