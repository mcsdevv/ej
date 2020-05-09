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

    if (nhk.particleReading.length) {
        nhk.particleReading.forEach((wP) => {
            DB().insert('ParticleReading', {
                wordId: wordId,
                downstep: head(wP.downsteps),
                audioFile: getParticleReadingfileName(wP),
                katakana: wP.kana.katakana,
                nasal: wP.kana.nasal.join(','),
                unVoiced: wP.kana.unVoiced.join(','),
            })
        })
    }

    nhk.readings.forEach((r) => {
        DB().insert('Reading', {
            wordId: wordId,
            downstep: head(r.downsteps),
            audioFile: getReadingfileName(r),
            katakana: r.kana.katakana,
            nasal: r.kana.nasal.join(','),
            unVoiced: r.kana.unVoiced.join(','),
        })
    })
})

console.log('Finished!!!')
