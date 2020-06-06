#!/usr/bin/env ts-node-script

import B2 from 'backblaze-b2'
import { readdirSync, readFileSync } from 'fs-extra'
import * as A from 'fp-ts/lib/Array'
import { cons } from 'fp-ts/lib/NonEmptyArray'

const bucketId = '0678b80ac48c6a9873220012'

const b2 = new B2({
    applicationKeyId: '002688a4ca832020000000001', // or accountId: 'accountId'
    applicationKey: 'K0027K0PLvdEofKGUszfyAbJ56P38Sk', // or masterApplicationKey
})

const path = 'public/audio/readings'

const processChunk = async (chunk: string[]) => {
    let { data: urlRes } = await b2.getUploadUrl({ bucketId })
    console.log('urlRes: ', urlRes)
    while (chunk.length) {
        const file = chunk.pop()
        try {
            await b2.uploadFile({
                ...urlRes,
                fileName: file,
                data: readFileSync(`${path}/${file}`),
                uploadAuthToken: urlRes.authorizationToken,
            })
        } catch (e) {
            console.log(e)
            ;({ data: urlRes } = await b2.getUploadUrl({ bucketId }))
            chunk.unshift(file)
        }
    }
}

export async function blah() {
    try {
        await b2.authorize() // must authorize first
        const { data: listRes } = await b2.listFileNames({
            bucketId: bucketId,
            startFileName: '.bzEmpty',
            maxFileCount: 1000,
            delimiter: '',
            prefix: '',
        })
        console.log('deleting files..')

        listRes.files.map(async (file) => {
            await b2.deleteFileVersion(file)
        })

        // console.log('fileList', listRes.files)

        console.log('starting to upload files')
        const toUpload = readdirSync(path)

        let total = 0

        const chunkSize = 10
        for (const chunk of A.chunksOf(chunkSize)(toUpload)) {
            processChunk(chunk).then(() => {
                total += chunkSize
                console.log(
                    toUpload.length +
                        '/' +
                        total +
                        '  ' +
                        (total * 100) / toUpload.length,
                )
            })
        }
    } catch (err) {
        console.log('Error getting bucket:', err)
    }
}

blah()
