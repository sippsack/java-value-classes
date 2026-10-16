import { createServer } from 'node:http'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { runDevJava } from './devjava.mjs'

export function createProxy({ origins, execute = runDevJava, logger = console }) {
  if (!origins.length || origins.some(origin => {
    try { return new URL(origin).origin !== origin || !/^https?:/.test(origin) }
    catch { return true }
  })) {
    throw new Error('JAVA_SANDBOX_ALLOWED_ORIGINS muss konkrete HTTP(S)-Origins enthalten, ohne Pfad oder abschließenden Slash.')
  }
  let busy = false
  return createServer(async (req, res) => {
    const reply = (status, data) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
      res.end(JSON.stringify(data))
    }
    res.setHeader('Vary', 'Origin')
    if (!origins.includes(req.headers.origin)) {
      reply(403, { error: 'Origin nicht freigegeben.' })
      return
    }
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
    if (req.url !== '/run') {
      reply(404, { error: 'Unbekannter Endpunkt.' })
      return
    }
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '600',
      })
      res.end()
      return
    }
    if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
      reply(400, { error: 'POST mit Content-Type application/json erwartet.' })
      return
    }
    try {
      const chunks = []
      let bytes = 0
      for await (const chunk of req) {
        bytes += chunk.length
        if (bytes > 32 * 1024) {
          reply(413, { error: 'Maximal 32 KiB pro Anfrage erlaubt.' })
          return
        }
        chunks.push(chunk)
      }
      let input
      try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')) }
      catch {
        reply(400, { error: 'Ungültiges JSON.' })
        return
      }
      if (typeof input?.code !== 'string' || !input.code.trim()) {
        reply(400, { error: 'Java-Code fehlt.' })
        return
      }
      if (busy) {
        reply(429, { error: 'Proxy ist beschäftigt. Bitte kurz warten.' })
        return
      }
      busy = true
      try {
        reply(200, await execute(input.code))
      }
      finally {
        busy = false
      }
    }
    catch (error) {
      logger.error(`[dev.java proxy] ${error.message}`)
      if (!res.headersSent) reply(502, { error: `Externe Ausführung fehlgeschlagen: ${error.message}` })
    }
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const origins = (process.env.JAVA_SANDBOX_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
  const port = Number(process.env.PORT || 3049)
  const host = process.env.HOST || '127.0.0.1'
  const server = createProxy({ origins })
  server.requestTimeout = 30_000
  server.headersTimeout = 10_000
  server.listen(port, host, () => console.log(`dev.java-Proxy auf ${host}:${port}/run für ${origins.join(', ')}`))
  server.on('error', error => {
    console.error(`Proxy konnte nicht starten: ${error.message}`)
    process.exitCode = 1
  })
}
