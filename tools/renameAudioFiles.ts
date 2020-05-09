#!/usr/bin/env ts-node-script
import * as R from 'rambda'
import * as _ from 'lodash'
import { renameSync, removeSync, existsSync, readdirSync } from 'fs-extra'

import { parseFile } from '../src/dataCleaning/utils'

const dir = 'public/audio/readings'

readdirSync(dir).forEach((fileName) => {
    renameSync(`${dir}/${fileName}`, `${dir}/${fileName.normalize()}`)
})

// const readings = _.flatMap(parseFile(), (x) => x.readings)
// const particleReadings = _.flatMap(parseFile(), (x) => x.particleReading)

// const groupedReadings = R.groupBy(
//     (r) =>
//         `${r.kana.katakana}|${r.downsteps}|${r.kana.nasal}|${r.kana.unVoiced}.wav`,
//     readings,
// )

// const groupedParticleReadings = R.groupBy(
//     (r) =>
//         `${r.kana.katakana}|${r.downsteps}|${r.kana.nasal}|${r.kana.unVoiced}|${r.particle}.wav`,
//     particleReadings,
// )

// const grouped = R.merge(groupedReadings, groupedParticleReadings)

// R.pipe(
//     R.keys,
//     R.map((key) => ({
//         newName: key,
//         toRename: R.head(grouped[key]).audioFile,
//         toDelete: R.tail(grouped[key]),
//     })),
//     R.forEach(({ newName, toRename, toDelete }) => {
//         if (existsSync(`${dir}/${toRename}`)) {
//             renameSync(`${dir}/${toRename}`, `${dir}/${newName}`)
//         }

//         toDelete
//             .map((x) => x.audioFile)
//             .forEach((filename) => {
//                 if (existsSync(`${dir}/${filename}`)) {
//                     removeSync(`${dir}/${filename}`)
//                 }
//             })
//     }),
// )(grouped)
