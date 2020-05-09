#!/usr/bin/env ts-node-script
import { readdirSync, renameSync } from 'fs-extra'

const dir = 'public/audio'
readdirSync(dir).forEach((x) => {
    renameSync(`${dir}/${x}`, `${dir}/${x.normalize()}`)
})
