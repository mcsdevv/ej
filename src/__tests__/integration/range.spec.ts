import http from 'http'
import fetch from 'node-fetch'
import listen from 'test-listen'
import { apiResolver } from 'next-server/dist/server/api-utils'
import handler from '../../pages/api/range/[_mode]'

describe('/api/range', () => {
    let url
    let server
    beforeEach(async () => {
        let requestHandler = (req, res) => {
            return apiResolver(req, res, undefined, handler)
        }
        server = http.createServer(requestHandler)
        url = await listen(server)
    })

    it('gets passed no parameter', async () => {
        const response = await fetch(url)
        expect(response.status).toEqual(400)

        const json = await response.json()

        expect(json).toEqual({ error: `invalid parameter: ${undefined}` })

        return server.close()
    })

    it('gets passed invalid parameter', async () => {
        const query = {
            _mode: 'invalid',
        }
        const response = await fetch(
            url + '?' + new URLSearchParams(query).toString(),
        )

        expect(response.status).toEqual(400)

        const json = await response.json()

        expect(json).toEqual({ error: `invalid parameter: invalid` })

        return server.close()
    })
    it('gets readings range', async () => {
        const query = {
            _mode: 'readings',
        }
        const response = await fetch(
            url + '?' + new URLSearchParams(query).toString(),
        )
        expect(response.status).toEqual(200)

        const json = await response.json()

        expect(json).toEqual(7)

        return server.close()
    })

    it('gets withParticles range', async () => {
        const query = {
            _mode: 'withParticle',
        }
        const response = await fetch(
            url + '?' + new URLSearchParams(query).toString(),
        )
        expect(response.status).toEqual(200)

        const json = await response.json()

        expect(json).toEqual(4)

        return server.close()
    })

    it('gets sentences range', async () => {
        const query = {
            _mode: 'sentences',
        }
        const response = await fetch(
            url + '?' + new URLSearchParams(query).toString(),
        )
        expect(response.status).toEqual(200)

        const json = await response.json()

        expect(json).toEqual(757)

        return server.close()
    })
})
