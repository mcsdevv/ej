import http from 'http'
import fetch from 'node-fetch'
import listen from 'test-listen'
import { apiResolver } from 'next-server/dist/server/api-utils'
import handler from '../../pages/api/chunk/[_mode]/[_chunkId]'

import { some } from 'fp-ts/lib/Option'

jest.mock('../../backend/common/readings')
jest.mock('../../backend/common/sentences')
jest.mock('../../backend/common/withParticle')
describe('/api/chunk', () => {
    let url
    let server
    beforeEach(async () => {
        let requestHandler = (req, res) => {
            return apiResolver(req, res, undefined, handler)
        }
        server = http.createServer(requestHandler)
        url = await listen(server)
    })

    it('gets passed no chunkid parameter', async () => {
        const response = await fetch(url)
        expect(response.status).toEqual(400)

        const json = await response.json()

        expect(json).toEqual({ error: `invalid mode: ${undefined}` })

        return server.close()
    })

    it('gets passed invalid chunkid parameter', async () => {
        const query = {
            _mode: 'readings',
            _chunkId: '-1',
        }
        const response = await fetch(
            url + '?' + new URLSearchParams(query).toString(),
        )

        expect(response.status).toEqual(400)

        const json = await response.json()

        expect(json).toEqual({ error: `invalid chunkId: -1` })

        return server.close()
    })
    it('gets readings', async () => {
        const query = {
            _mode: 'readings',
            _chunkId: '0',
        }
        const response = await fetch(
            url + '?' + new URLSearchParams(query).toString(),
        )

        const json = await response.json()

        expect(json.map((x) => x.katakana)).toEqual([
            'モチツキ',
            'モチツキ',
            'モチツキ',
        ])

        expect(response.status).toEqual(200)

        return server.close()
    })

    it('gets withParticles range', async () => {
        const query = {
            _mode: 'withParticle',
            _chunkId: '0',
        }
        const response = await fetch(
            url + '?' + new URLSearchParams(query).toString(),
        )
        expect(response.status).toEqual(200)

        const json = await response.json()

        expect(json.map((x) => x.particle)).toEqual([
            some('オ'),
            some('オ'),
            some('オ'),
        ])

        return server.close()
    })

    it('gets sentences range', async () => {
        const query = {
            _mode: 'sentences',
            _chunkId: '0',
        }
        const response = await fetch(
            url + '?' + new URLSearchParams(query).toString(),
        )
        expect(response.status).toEqual(200)

        const json = await response.json()

        expect(json.map((x) => x.sentence)).toEqual([
            '暗い夜道はキミガ悪い',
            'やや楽観ムードのキミガある',
            '良い卵のキミワ盛り上がっている',
            '無視されたのかキミトも呼ばれず',
        ])

        return server.close()
    })
})
