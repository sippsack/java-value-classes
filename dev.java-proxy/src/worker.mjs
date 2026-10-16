import { runExternal, validateExternal } from '../../slides/sandbox/external.mjs'

class BodyLimitError extends Error {}

async function boundedBody(stream, maximum) {
  if (!stream) return new Uint8Array()
  const reader = stream.getReader()
  const chunks = []
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maximum) {
        await reader.cancel()
        throw new BodyLimitError(`Maximal ${maximum} Bytes erlaubt.`)
      }
      chunks.push(value)
    }
  }
  finally {
    reader.releaseLock()
  }
  const body = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  return body
}

async function boundedFetch(url, options) {
  const response = await fetch(url, options)
  const body = await boundedBody(response.body, 256 * 1024)
  return new Response(body, { status: response.status, headers: response.headers })
}

export function createHandler(execute = (code, options) => runExternal(code, options, boundedFetch)) {
  return async (request, env) => {
    const origin = request.headers.get('Origin')
    const origins = (env.ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean)
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Vary': 'Origin',
      'X-Content-Type-Options': 'nosniff',
    }
    const reply = (status, data) => Response.json(data, { status, headers })
    if (!origin || !origins.includes(origin)) return reply(403, { error: 'Origin nicht freigegeben.' })
    headers['Access-Control-Allow-Origin'] = origin
    if (new URL(request.url).pathname !== '/run') return reply(404, { error: 'Unbekannter Endpunkt.' })
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...headers,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '600',
        },
      })
    }
    if (request.method !== 'POST') return reply(405, { error: 'POST erwartet.' })
    if (request.headers.get('Content-Type') !== 'application/json') {
      return reply(415, { error: 'Content-Type application/json erwartet.' })
    }
    try {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
      if (!(await env.PER_IP.limit({ key: ip })).success
          || !(await env.TOTAL.limit({ key: 'execute' })).success) {
        headers['Retry-After'] = '60'
        return reply(429, { error: 'Zu viele Ausführungen. Bitte eine Minute warten.' })
      }
      let input
      const body = await boundedBody(request.body, 32 * 1024)
      try { input = JSON.parse(new TextDecoder().decode(body)) }
      catch { return reply(400, { error: 'Ungültiges JSON.' }) }
      if (typeof input?.code !== 'string' || !input.code.trim()) {
        return reply(400, { error: 'Java-Code fehlt.' })
      }
      try { validateExternal(input) }
      catch (error) { return reply(400, { error: error.message }) }
      return reply(200, await execute(input.code, { provider: input.provider, preview: input.preview }))
    }
    catch (error) {
      if (error instanceof BodyLimitError) return reply(413, { error: error.message })
      // Never log submitted code or the provider's response body.
      console.error('Externe Java-Ausführung fehlgeschlagen:', error.name)
      return reply(502, { error: 'Externe Sandbox nicht erreichbar, Zeitlimit überschritten oder ungültige Provider-Antwort.' })
    }
  }
}

export default { fetch: createHandler() }
