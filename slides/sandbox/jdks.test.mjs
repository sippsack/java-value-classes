import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { compareVersions, saveJdks } from './jdks.mjs'

test('JDKs sort numerically, including EA build numbers', () => {
  const entries = ['9', '28-ea+9', '26.0.2', '28-ea+19', '21.0.10', '21.0.9', '25+35-3488', '25.0.2+10-69']
    .map(version => ({ version, home: `/${version}` }))
  assert.deepEqual(entries.sort(compareVersions).map(entry => entry.version),
    ['28-ea+19', '28-ea+9', '26.0.2', '25.0.2+10-69', '25+35-3488', '21.0.10', '21.0.9', '9'])
})

test('env inventory is idempotent and preserves unrelated configuration', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'sandbox-env-'))
  try {
    const file = join(directory, '.env.local')
    await writeFile(file, 'VITE_JAVA_SANDBOX_PROXY_URL=https://example.test/run\n')
    const entries = [{ home: "/jdk's/path" }, { home: '/other jdk' }]
    await saveJdks(file, entries)
    const first = await readFile(file, 'utf8')
    await saveJdks(file, entries)
    assert.equal(await readFile(file, 'utf8'), first)
    assert.match(first, /VITE_JAVA_SANDBOX_PROXY_URL=https:\/\/example.test\/run/)
    assert.equal((first.match(/JAVA_SANDBOX_JDKS=/g) || []).length, 1)
    const value = first.match(/JAVA_SANDBOX_JDKS='(.*)'/)[1]
    assert.deepEqual(JSON.parse(value), entries.map(entry => entry.home))
  }
  finally { await rm(directory, { recursive: true }) }
})
