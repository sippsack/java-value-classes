import { execFile } from 'node:child_process'
import { access, readdir, realpath, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { delimiter, dirname, join } from 'node:path'
import { promisify } from 'node:util'

const execute = promisify(execFile)

export function compareVersions(a, b) {
  for (const pattern of [/^\d+(?:\.\d+)*/, /\+(\d+(?:-\d+)*)/]) {
    const numbers = version => {
      const match = version.match(pattern)
      return (match?.[1] || match?.[0] || '').match(/\d+/g)?.map(Number) || []
    }
    const left = numbers(a.version)
    const right = numbers(b.version)
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
      const difference = (right[i] || 0) - (left[i] || 0)
      if (difference) return difference
    }
  }
  return a.home.localeCompare(b.home)
}

export async function discoverJdks({ configured = [], logger = console } = {}) {
  const candidates = new Set([...configured, process.env.JAVA_HOME, process.env.JAVA_SANDBOX_HOME].filter(Boolean))
  const roots = [
    join(process.env.SDKMAN_DIR || join(homedir(), '.sdkman'), 'candidates/java'),
    join(homedir(), 'Library/Java/JavaVirtualMachines'),
    '/Library/Java/JavaVirtualMachines', '/usr/lib/jvm', '/usr/java',
    '/opt/homebrew/opt', '/usr/local/opt',
    ...(process.platform === 'win32' ? [join(process.env.ProgramFiles || 'C:\\Program Files', 'Java')] : []),
  ]
  for (const root of roots) {
    let entries
    try { entries = await readdir(root, { withFileTypes: true }) }
    catch (error) {
      if (error.code === 'ENOENT') continue
      logger.warn(`JDK-Verzeichnis nicht lesbar: ${root}: ${error.message}`)
      continue
    }
    for (const entry of entries) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue
      if (root.endsWith('/opt') && !entry.name.startsWith('openjdk')) continue
      candidates.add(join(root, entry.name))
      candidates.add(join(root, entry.name, 'Contents/Home'))
      candidates.add(join(root, entry.name, 'libexec/openjdk.jdk/Contents/Home'))
    }
  }
  for (const path of (process.env.PATH || '').split(delimiter)) {
    try {
      const binary = await realpath(join(path, process.platform === 'win32' ? 'java.exe' : 'java'))
      candidates.add(dirname(dirname(binary)))
    }
    catch (error) {
      if (!['ENOENT', 'ENOTDIR'].includes(error.code)) logger.warn(`Java aus PATH nicht lesbar: ${error.message}`)
    }
  }
  const found = new Map()
  for (const candidate of candidates) {
    let home
    try {
      home = await realpath(candidate)
      await access(join(home, 'release'))
      await access(join(home, 'bin', process.platform === 'win32' ? 'javac.exe' : 'javac'))
    }
    catch (error) {
      if (!['ENOENT', 'ENOTDIR'].includes(error.code)) logger.warn(`JDK nicht lesbar: ${candidate}: ${error.message}`)
      continue
    }
    if (found.has(home)) continue
    try {
      const release = await readFile(join(home, 'release'), 'utf8')
      const declaredVersion = release.match(/^JAVA_VERSION="([^"]+)"/m)?.[1]
      if (declaredVersion && Number.parseInt(declaredVersion) < 17) continue
      const { stdout } = await execute(join(home, 'bin', 'java'), ['--version'], { timeout: 3000 })
      const version = stdout.match(/Runtime Environment.*\(build ([^)]+)\)/)?.[1]
        || stdout.match(/^(?:openjdk|java) ([^\s]+)/m)?.[1]
      if (!version || Number.parseInt(version) < 17) continue
      const modules = await execute(join(home, 'bin', 'java'), ['--list-modules'], { timeout: 3000 })
      if (!/^jdk.jshell@/m.test(modules.stdout)) continue
      found.set(home, { home, version })
    }
    catch (error) {
      logger.warn(`JDK nicht verwendbar: ${home}: ${error.message}`)
    }
  }
  return [...found.values()].sort(compareVersions)
}

export async function saveJdks(file, jdks) {
  let content = ''
  try { content = await readFile(file, 'utf8') }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  const line = `JAVA_SANDBOX_JDKS='${JSON.stringify(jdks.map(jdk => jdk.home)).replaceAll("'", "\\u0027")}'`
  const next = /^JAVA_SANDBOX_JDKS=.*$/m.test(content)
    ? content.replace(/^JAVA_SANDBOX_JDKS=.*$/m, () => line)
    : `${content}${content && !content.endsWith('\n') ? '\n' : ''}${line}\n`
  if (next !== content) await writeFile(file, next)
}
