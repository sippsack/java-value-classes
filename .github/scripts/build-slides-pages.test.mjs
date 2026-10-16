import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { test } from 'node:test'

const script = resolve('.github/scripts/build-slides-pages.sh')

test('Pages combines main, tags, experimental slides and sandbox with correct bases', () => {
  const root = mkdtempSync(join(tmpdir(), 'slides-pages-test-'))
  const git = (...args) => execFileSync('git', args, { cwd: root, stdio: 'pipe' })
  try {
    mkdirSync(join(root, 'slides'))
    mkdirSync(join(root, 'bin'))
    git('init', '-q')
    git('config', 'user.email', 'test@example.invalid')
    git('config', 'user.name', 'Pages test')
    writeFileSync(join(root, 'slides/version'), 'main')
    git('add', 'slides')
    git('commit', '-qm', 'Main fixture')
    git('update-ref', 'refs/remotes/origin/main', 'HEAD')
    git('tag', 'published/event')
    writeFileSync(join(root, 'slides/version'), 'experimental')
    git('commit', '-qam', 'Experimental fixture')
    git('update-ref', 'refs/remotes/origin/experimental', 'HEAD')
    const mock = `#!/usr/bin/env bash
set -euo pipefail
if [[ "$1" == ci ]]; then exit 0; fi
base=''
out=''
while [[ $# -gt 0 ]]; do
  case "$1" in
    --base) base="$2"; shift 2 ;;
    --out) out="$2"; shift 2 ;;
    *) shift ;;
  esac
done
[[ -n "$base" && -n "$out" ]]
mkdir -p "$out"
printf '%s:%s' "$(cat version)" "$base" > "$out/index.html"
`
    for (const name of ['npm', 'npx']) {
      writeFileSync(join(root, 'bin', name), mock, { mode: 0o755 })
    }
    execFileSync('bash', [script], {
      cwd: root,
      env: {
        ...process.env,
        PATH: `${join(root, 'bin')}:${process.env.PATH}`,
        PAGES_BASE_PATH: '/java-value-classes',
        EXPERIMENTAL_REF: '',
      },
      stdio: 'pipe',
    })
    for (const [path, expected] of [
      ['index.html', 'main:/java-value-classes/'],
      ['event/index.html', 'main:/java-value-classes/event/'],
      ['experimental/index.html', 'experimental:/java-value-classes/experimental/'],
      ['experimental/sandbox/index.html', 'experimental:/java-value-classes/experimental/sandbox/'],
    ]) {
      assert.equal(readFileSync(join(root, 'pages-dist', path), 'utf8'), expected)
    }
  }
  finally {
    rmSync(root, { recursive: true, force: true })
  }
})
