import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { test } from 'node:test'

const script = resolve('.github/scripts/build-slides-pages.sh')

test('Pages combines main, tags and all experimental branches, with optional sandboxes', () => {
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
    writeFileSync(join(root, 'slides/sandbox.md'), '# Sandbox')
    git('add', 'slides')
    git('commit', '-qm', 'Experimental fixture')
    git('update-ref', 'refs/remotes/origin/experimental/java-sandbox', 'HEAD')
    rmSync(join(root, 'slides/sandbox.md'))
    writeFileSync(join(root, 'slides/version'), 'another-demo')
    git('add', 'slides')
    git('commit', '-qm', 'Another experimental fixture without sandbox')
    git('update-ref', 'refs/remotes/origin/experimental/neue-demo', 'HEAD')
    git('update-ref', 'refs/remotes/origin/experimental/group/nested', 'HEAD')
    const mock = `#!/usr/bin/env bash
set -euo pipefail
if [[ "$1" == ci ]]; then exit 0; fi
if [[ "$1" == --no-install ]]; then [[ -f sandbox.md ]]; fi
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
    const options = {
      cwd: root,
      env: {
        ...process.env,
        PATH: `${join(root, 'bin')}:${process.env.PATH}`,
        PAGES_BASE_PATH: '/java-value-classes',
      },
      stdio: 'pipe',
    }
    execFileSync('bash', [script], options)
    for (const [path, expected] of [
      ['index.html', 'main:/java-value-classes/'],
      ['event/index.html', 'main:/java-value-classes/event/'],
      ['experimental/java-sandbox/index.html', 'experimental:/java-value-classes/experimental/java-sandbox/'],
      ['experimental/java-sandbox/sandbox/index.html', 'experimental:/java-value-classes/experimental/java-sandbox/sandbox/'],
      ['experimental/neue-demo/index.html', 'another-demo:/java-value-classes/experimental/neue-demo/'],
      ['experimental/group/nested/index.html', 'another-demo:/java-value-classes/experimental/group/nested/'],
    ]) {
      assert.equal(readFileSync(join(root, 'pages-dist', path), 'utf8'), expected)
    }
    for (const invalid of ['bad+name', '_hidden']) {
      git('update-ref', `refs/remotes/origin/experimental/${invalid}`, 'HEAD')
      rmSync(join(root, 'pages-dist'), { recursive: true })
      assert.throws(() => execFileSync('bash', [script], options), /Command failed/)
      git('update-ref', '-d', `refs/remotes/origin/experimental/${invalid}`)
    }
    git('tag', 'published/experimental')
    rmSync(join(root, 'pages-dist'), { recursive: true })
    assert.throws(() => execFileSync('bash', [script], options), /Command failed/)
  }
  finally {
    rmSync(root, { recursive: true, force: true })
  }
})
