import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createHandler } from '../src/worker.mjs'

const origin = 'https://www.sippsack.de'
const env = {
  ALLOWED_ORIGINS: origin,
  PER_IP: { limit: async () => ({ success: true }) },
  TOTAL: { limit: async () => ({ success: true }) },
}
const request = (body = '{"code":"System.out.println(42);"}', overrides = {}) => new Request('https://proxy.example/run', {
  method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body, ...overrides,
})

test('forwards code and returns results with exact CORS origin', async () => {
  const handler = createHandler(async code => {
    assert.equal(code, 'System.out.println(42);')
    return { ok: true, runtime: 'dev.java', output: '42' }
  })
  const result = await handler(request(), env)
  assert.equal(result.status, 200)
  assert.equal(result.headers.get('Access-Control-Allow-Origin'), origin)
  assert.equal((await result.json()).output, '42')
})

test('preflight, origin, method, path and input validation', async () => {
  const handler = createHandler(() => { throw Error('must not execute') })
  assert.equal((await handler(request(undefined, { method: 'OPTIONS', body: undefined }), env)).status, 204)
  assert.equal((await handler(request(undefined, { headers: { Origin: 'https://other.example' } }), env)).status, 403)
  assert.equal((await handler(request(undefined, { method: 'GET', body: undefined }), env)).status, 405)
  assert.equal((await handler(new Request('https://proxy.example/other', { headers: { Origin: origin } }), env)).status, 404)
  assert.equal((await handler(request('{'), env)).status, 400)
  assert.equal((await handler(request('null'), env)).status, 400)
  assert.equal((await handler(request('{"code":" "}'), env)).status, 400)
  assert.equal((await handler(request(JSON.stringify({ code: 'x'.repeat(33 * 1024) })), env)).status, 413)
})

test('rate limits and upstream errors remain visible to the client', async () => {
  const handler = createHandler(async () => { throw Error('upstream error') })
  assert.equal((await handler(request(), {
    ...env, PER_IP: { limit: async () => ({ success: false }) },
  })).status, 429)
  assert.equal((await handler(request(), {
    ...env, TOTAL: { limit: async () => ({ success: false }) },
  })).status, 429)
  const response = await handler(request(), env)
  assert.equal(response.status, 502)
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin)
})

test('provider and preview reach the adapter; unsupported destinations and flags are rejected', async () => {
  const handler = createHandler(async (code, options) => {
    assert.equal(code, 'System.out.println(42);')
    assert.equal(options.provider, 'https://javaalmanac.io/jdk/28/')
    assert.equal(options.preview, false)
    return { ok: true, runtime: 'Almanac', output: '42' }
  })
  const input = { code: 'System.out.println(42);', provider: 'https://javaalmanac.io/jdk/28/', preview: false }
  assert.equal((await handler(request(JSON.stringify(input)), env)).status, 200)
  assert.equal((await handler(request(JSON.stringify({ ...input, provider: 'https://example.com' })), env)).status, 400)
  assert.equal((await handler(request(JSON.stringify({ ...input, provider: 'https://dev.java/playground/' })), env)).status, 400)
})
