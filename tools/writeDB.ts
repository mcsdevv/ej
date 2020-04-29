#!/usr/bin/env ts-node-script
import { writeToDB, parseFile } from '../src/backend/utils'

console.log('Starting writing to db..')
writeToDB(parseFile())
console.log('Finished!!!')
