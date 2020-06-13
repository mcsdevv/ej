import http from 'http'
import fetch from 'node-fetch'
import listen from 'test-listen'
import { apiResolver } from 'next-server/dist/server/api-utils'
import handler from '../../pages/api/range/[_mode]'

describe('/api/range', () => {
    it('responds 200 to authed GET', async () => {
        let requestHandler = (req, res) => {
            return apiResolver(req, res, undefined, handler)
        }
        let server = http.createServer(requestHandler)
        let url = await listen(server)
        const query = {
            _mode: 'readings',
        }
        const response = await fetch(
            url + '?' + new URLSearchParams(query).toString(),
        )
        expect(response.status).toEqual(200)

        const json = await response.json()

        expect(json).toEqual(3)

        return server.close()
    })
})
