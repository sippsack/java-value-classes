import assert from 'node:assert/strict'
import { test } from 'node:test'
import { almanacUrl, runExternal, validateExternal } from './external.mjs'

test('unknown destinations and unsupported preview settings are rejected', () => {
  assert.throws(() => validateExternal({ provider: 'https://evil.example' }), /Unbekannt/)
  assert.throws(() => validateExternal({ preview: false }), /Preview fest/)
  assert.throws(() => validateExternal({ preview: 'true' }), /Boolean/)
})

test('Almanac wraps snippets, hoists imports and forwards preview selection', async () => {
  const result = await runExternal('import java.util.List;\nSystem.out.println(List.of(42));', {
    provider: almanacUrl, preview: false,
  }, async (url, options) => {
    assert.equal(url, 'https://sandbox.javaalmanac.io/jdk/28/runfromsource')
    const body = JSON.parse(options.body)
    assert.equal(body.preview, false)
    assert.equal(body.mainclass, 'Sandbox.java')
    assert.match(body.sourcefiles[0].content, /^import java.util.List;/)
    assert.match(body.sourcefiles[0].content, /public static void main/)
    return Response.json({ compilesuccess: true, runstatus: 0, output: '[42]\n' })
  })
  assert.equal(result.ok, true)
  assert.equal(result.output, '[42]\n')
})

test('Almanac compile and service failures are visible', async () => {
  const options = { provider: almanacUrl }
  const result = await runExternal('invalid', options, async () => Response.json({
    compilesuccess: false, output: 'Compiler error',
  }))
  assert.equal(result.ok, false)
  await assert.rejects(runExternal('x', options, async () => new Response('', { status: 500 })), /HTTP 500/)
  await assert.rejects(runExternal('x', options, async () => Response.json({})), /Antwortformat/)
})
