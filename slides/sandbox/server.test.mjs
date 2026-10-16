import assert from 'node:assert/strict'
import { createServer, request as httpRequest } from 'node:http'
import { once } from 'node:events'
import { test } from 'node:test'
import { javaSandbox, runJava } from './server.mjs'

test('local JShell evaluates snippets and resets state', async () => {
  const first = await runJava('int answer = 42;\nSystem.out.println("Grüße: " + answer);\nanswer + 1')
  assert.equal(first.ok, true)
  assert.match(first.runtime, /^\d+/)
  assert.match(first.output, /Grüße: 42/)
  assert.match(first.output, /=> 43/)
  const second = await runJava('System.out.println(answer);')
  assert.equal(second.ok, false)
  assert.match(second.output, /answer/)
})

test('compiler errors, incomplete input and exceptions are visible', async () => {
  const invalid = await runJava('int x = "no";')
  assert.equal(invalid.ok, false)
  assert.match(invalid.output, /Fehler:/)
  const incomplete = await runJava('class Missing {')
  assert.equal(incomplete.ok, false)
  assert.match(incomplete.output, /Unvollständig/)
  const exception = await runJava('throw new IllegalStateException("demo");')
  assert.equal(exception.ok, false)
  assert.match(exception.output, /demo/)
})

test('stdout, stderr and JSON escaping survive transport', async () => {
  const result = await runJava('System.err.println("Fehlerausgabe");\nSystem.out.println("\\\"\\\\\\t");')
  assert.equal(result.ok, true)
  assert.match(result.output, /Fehlerausgabe/)
  assert.match(result.output, /"\\\t/)
})

test('endless snippets are killed within the execution limit', async () => {
  await assert.rejects(runJava('while (true) {}'), /Zeitlimit/)
})

test('premature process exit is not reported as success', async () => {
  await assert.rejects(runJava('System.exit(0);'), /Keine gültige Antwort/)
})

test('HTTP bridge blocks foreign origins and validates requests', async () => {
  let middleware
  javaSandbox().configureServer({
    config: { server: {}, logger: { error() {} } },
    middlewares: { use(_path, handler) { middleware = handler } },
  })
  const server = createServer((req, res) => {
    req.url = req.url.replace('/__java-sandbox', '')
    middleware(req, res)
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const base = `http://127.0.0.1:${server.address().port}`
  const headers = { Origin: base, 'Content-Type': 'application/json', 'X-Java-Sandbox': '1' }
  const request = (body, extraHeaders = {}) => fetch(`${base}/__java-sandbox/run`, {
    method: 'POST', headers: { ...headers, ...extraHeaders }, body,
  })
  try {
    assert.equal((await request('{}', { Origin: 'https://example.com' })).status, 403)
    const foreignHostStatus = await new Promise((resolve, reject) => {
      const req = httpRequest(base, {
        method: 'POST', headers: { ...headers, Host: 'example.com' },
      }, res => {
        res.resume()
        resolve(res.statusCode)
      })
      req.on('error', reject)
      req.end('{}')
    })
    assert.equal(foreignHostStatus, 403)
    assert.equal((await request('{}', { 'X-Java-Sandbox': '' })).status, 403)
    assert.equal((await request('{')).status, 400)
    assert.equal((await request('null')).status, 400)
    assert.equal((await request('{"code":"  "}')).status, 400)
    assert.equal((await request('{"code":"42","jdk":"/untrusted/path"}')).status, 400)
    assert.equal((await request('{"code":"42","preview":"false"}')).status, 400)
    assert.equal((await request('x'.repeat(33 * 1024))).status, 413)
    const response = await request(JSON.stringify({ code: 'System.out.println(6 * 7);' }))
    assert.equal(response.status, 200)
    assert.match((await response.json()).output, /42/)
  }
  finally {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
  }
})

test('preview is disabled in both compiler and execution JVM', async () => {
  const result = await runJava('System.out.println("no preview");', undefined, false)
  assert.equal(result.ok, true)
  assert.match(result.output, /no preview/)
  const flagsCode = 'System.out.println(java.lang.management.ManagementFactory.getRuntimeMXBean().getInputArguments());'
  assert.doesNotMatch((await runJava(flagsCode, undefined, false)).output, /--enable-preview/)
  assert.match((await runJava(flagsCode, undefined, true)).output, /--enable-preview/)
  const previewCode = 'value class PreviewValue { final int x = 1; }'
  const enabled = await runJava(previewCode)
  if (enabled.ok) assert.equal((await runJava(previewCode, undefined, false)).ok, false)
})

test('JDK inventory exposes sorted choices without allowing arbitrary execution paths', async () => {
  let handler
  const jdks = [{ home: '/jdk-28', version: '28-ea+17' }, { home: '/jdk-21', version: '21.0.6' }]
  javaSandbox({ jdks }).configureServer({
    config: { server: {}, logger: { error() {} } },
    middlewares: { use(_path, middleware) { handler = middleware } },
  })

  await test('same-origin external route forwards provider and preview and rejects foreign origins', async () => {
    let handler
    let calls = 0
    javaSandbox({
      executeExternal: async (code, options) => {
        calls++
        assert.equal(code, 'System.out.println(42);')
        assert.deepEqual(options, { provider: 'https://javaalmanac.io/jdk/28/', preview: false })
        return { ok: true, output: '42', runtime: 'Almanac' }
      },
    }).configureServer({
      config: { server: {}, logger: { error() {} } },
      middlewares: { use(_path, middleware) { handler = middleware } },
    })
    const server = createServer(handler)
    server.listen(0, '127.0.0.1')
    await once(server, 'listening')
    const origin = `http://127.0.0.1:${server.address().port}`
    const headers = { Origin: origin, 'Content-Type': 'application/json', 'X-Java-Sandbox': '1' }
    const body = JSON.stringify({ code: 'System.out.println(42);', provider: 'https://javaalmanac.io/jdk/28/', preview: false })
    try {
      const response = await fetch(`${origin}/external`, { method: 'POST', headers, body })
      assert.equal(response.status, 200)
      assert.equal((await response.json()).output, '42')
      const foreign = await fetch(`${origin}/external`, {
        method: 'POST', headers: { ...headers, Origin: 'https://foreign.example' }, body,
      })
      assert.equal(foreign.status, 403)
      assert.equal(calls, 1)
      const invalid = await fetch(`${origin}/external`, {
        method: 'POST', headers, body: JSON.stringify({ code: '42', provider: 'https://unknown.example' }),
      })
      assert.equal(invalid.status, 400)
      assert.equal(calls, 1)
    }
    finally {
      server.closeAllConnections()
      await new Promise(resolve => server.close(resolve))
    }
  })
  const server = createServer(handler)
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const origin = `http://127.0.0.1:${server.address().port}`
  try {
    const result = await fetch(`${origin}/jdks`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json', 'X-Java-Sandbox': '1' },
      body: '{}',
    })
    assert.equal(result.status, 200)
    assert.deepEqual(await result.json(), { jdks, defaultHome: '/jdk-28' })
  }
  finally {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
  }
})
