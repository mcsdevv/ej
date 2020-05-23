#!/usr/bin/env ts-node-script
import {
    parseFile,
    getReadingfileName,
    getParticleReadingfileName,
} from '../src/dataCleaning/utils'

import DB from 'better-sqlite3-helper'

import { head } from 'rambda'

const words = parseFile()
console.log('Starting writing to db..')

// removes compound words
const clean = words.filter(
    (x) =>
        !x.readings
            .map((x) => x.kana.katakana)
            .concat(x.particleReading.map((x) => x.kana.katakana))
            .find((x) => x.includes('・')),
)

DB({ migrate: { force: 'last' } })

clean.forEach((nhk) => {
    // console.log(nhk)
    const wordId = DB().insert('word', {
        jisho: nhk.jisho,
        jishoWord: nhk.jishoWord,
    })

    nhk.particleReading.forEach((wP) => {
        DB().insert('ParticleReading', {
            wordId: wordId,
            downStep: head(wP.downsteps),
            audioFile: getParticleReadingfileName(wP),
            katakana: wP.kana.katakana,
            nasal: wP.kana.nasal.join(','),
            unVoiced: wP.kana.unVoiced.join(','),
        })
    })

    nhk.examples.forEach((example) => {
        DB().insert('Example', {
            wordId: wordId,
            downStep: head(example.downsteps),
            audioFile: example.audioFile,
            katakana: example.kana.katakana,
            nasal: example.kana.nasal.join(','),
            unVoiced: example.kana.unVoiced.join(','),
            sentence: example.sentence,
        })
    })

    nhk.readings.forEach((r) => {
        DB().insert('Reading', {
            wordId: wordId,
            downStep: head(r.downsteps),
            audioFile: getReadingfileName(r),
            katakana: r.kana.katakana,
            nasal: r.kana.nasal.join(','),
            unVoiced: r.kana.unVoiced.join(','),
        })
    })
})

console.log('Finished!!!')
