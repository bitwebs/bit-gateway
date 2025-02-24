const http = require('http')
const SDK = require('@web4/sdk')
const makeFetch = require('@web4/unichain-fetch')
const { Readable } = require('stream')

module.exports = {
  create
}

const log = (...args) => console.log(...args)

async function create ({
  port,
  serverOpts = {
    logger: true
  },
  bitOpts = {},
  writable = false,
  persist = true,
  silent = false,
  p2pPort,
  storageLocation
} = {}) {
  const debug = silent ? require('debug')('bit-gateway') : log

  debug('Initializing server %O', {
    port,
    p2pPort,
    writable,
    storageLocation,
    persist
  })

  const sdk = await SDK({
    applicationName: 'bit-gateway',
    storage: storageLocation,
    persist,
    swarmOpts: {
      ephemeral: false,
      preferredPort: p2pPort
    },
    ...bitOpts
  })

  const { Bitdrive } = sdk

  const fetch = makeFetch({ Bitdrive, writable })

  const server = http.createServer(async (req, res) => {
    try {
      const { method, url, headers } = req
      debug('Request: %O', { method, url, headers })

      // TODO: Show something at the root?
      if (!url.startsWith('/bit/')) {
        res.writeHead(404)
        res.end('Not Found')
        return
      }

      const finalURL = 'bit://' + url.slice('/bit/'.length)

      const response = await fetch(finalURL, {
        method,
        headers,
        body: req
      })

      const responseHeaders = {}
      for (const [name, value] of response.headers) {
        responseHeaders[name] = value
      }
      const { status } = response

      debug('Requested: %O', { method, url: finalURL, status, responseHeaders })

      res.writeHead(response.status, responseHeaders)

      Readable.from(response.body).pipe(res)
    } catch (e) {
      debug(e)
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end(e.message)
    }
  })

  await new Promise((resolve, reject) => {
    server.listen(port, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })

  async function close () {
    await Promise.all([
      server.close(),
      sdk.close()
    ])
    debug('closed')
  }

  return { sdk, server, close }
}
