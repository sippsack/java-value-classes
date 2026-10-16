import assert from 'node:assert/strict'
import { once } from 'node:events'
import { test } from 'node:test'
import { runDevJava } from './devjava.mjs'
import { createProxy } from './proxy.mjs'

test('dev.java adapter encodes UTF-8 and preserves output, values and diagnostics', async () => {
  const code = 'System.out.println("Grüße");'
  const result = await runDevJava(code, async (url, options) => {
    assert.match(url, /^https:.*\/api\/execute$/)
    assert.equal(Buffer.from(JSON.parse(options.body).snippet, 'base64').toString('utf8'), code)
    return Response.json({ body: [
      { out: 'Grüße\n', val: '', exc: false, status: 'VALID' },
      { out: '', val: '42', exc: false, status: 'VALID' },
      { out: '', val: 'Compilerfehler', exc: true, status: 'REJECTED' },
    ] })
  })
  assert.equal(result.ok, false)
  assert.equal(result.output, 'Grüße\n=> 42\nFehler: Compilerfehler')
})

test('dev.java adapter surfaces HTTP, provider and schema failures', async () => {
  await assert.rejects(runDevJava('x', async () => new Response('', { status: 503 })), /HTTP 503/)
  await assert.rejects(runDevJava('x', async () => Response.json({ errorMessage: 'Unavailable' })), /Unavailable/)
  await assert.rejects(runDevJava('x', async () => Response.json({ body: [null] })), /Antwortformat/)
  const result = await runDevJava('x', async () => Response.json({ body: [] }))
  assert.equal(result.ok, true)
  assert.equal(result.output, '')
})

test('proxy requires explicit origins and rejects wildcard configuration', () => {
  assert.throws(() => createProxy({ origins: [] }), /Origins/)
  assert.throws(() => createProxy({ origins: ['*'] }), /Origins/)
})

test('proxy enforces origin, input and concurrency limits, forwards results and errors', async () => {
  let calls = 0
  let finish
  const proxy = createProxy({
    origins: ['http://slides.example'],
    logger: { error() {} },
    execute: async code => {
      calls++
      if (code === 'fail') throw new Error('Provider offline')
      if (code === 'wait') await new Promise(resolve => { finish = resolve })
      return { ok: true, runtime: 'test', output: code }
    },
  })
  proxy.listen(0, '127.0.0.1')
  await once(proxy, 'listening')
  const base = `http://127.0.0.1:${proxy.address().port}`
  const headers = { Origin: 'http://slides.example', 'Content-Type': 'application/json' }
  const send = (body, options = {}) => fetch(`${base}/run`, {
    method: 'POST', headers, body, ...options,
  })
  try {
    assert.equal((await send('{}', { headers: { ...headers, Origin: 'https://evil.example' } })).status, 403)
    assert.equal(calls, 0)
    const preflight = await fetch(`${base}/run`, { method: 'OPTIONS', headers })
    assert.equal(preflight.status, 204)
    assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), headers.Origin)
    assert.equal((await send('{')).status, 400)
    assert.equal((await send('null')).status, 400)
    assert.equal((await send(JSON.stringify({ code: 'x'.repeat(33 * 1024) }))).status, 413)
    const result = await send(JSON.stringify({ code: 'hello' }))
    assert.equal(result.status, 200)
    assert.equal((await result.json()).output, 'hello')
    const error = await send(JSON.stringify({ code: 'fail' }))
    assert.equal(error.status, 502)
    assert.match((await error.json()).error, /Provider offline/)
    const pending = send(JSON.stringify({ code: 'wait' }))
    while (!finish) await new Promise(resolve => setTimeout(resolve, 5))
    assert.equal((await send(JSON.stringify({ code: 'busy' }))).status, 429)
    finish()
    assert.equal((await pending).status, 200)
  }
  finally {
    finish?.()
    proxy.closeAllConnections()
    await new Promise(resolve => proxy.close(resolve))
  }
})
