import { execFile, spawn } from 'node:child_process'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const worker = fileURLToPath(new URL('./SnippetRunner.java', import.meta.url))
const maxCodeBytes = 32 * 1024
const maxOutputBytes = 128 * 1024
const timeoutMs = 10_000

export async function runJava(code, javaHome = process.env.JAVA_HOME) {
  const java = javaHome ? join(javaHome, 'bin', 'java') : 'java'
  const { stdout } = await execFileAsync(java, ['--version'], { timeout: 3000 })
  const feature = Number(stdout.match(/^(?:openjdk|java) (\d+)/m)?.[1])
  if (!Number.isInteger(feature) || feature < 17) {
    throw new Error('Die Sandbox braucht ein JDK ab Java 17 mit dem Modul jdk.jshell.')
  }

  return new Promise((resolve, reject) => {
    const child = spawn(java, [
      '-Xmx128m',
      '--enable-preview', '--source', String(feature),
      '--add-modules', 'jdk.jshell', worker,
    ], { stdio: ['pipe', 'pipe', 'pipe'] })
    let output = ''
    let errors = ''
    let bytes = 0
    let failure
    const timer = setTimeout(() => {
      failure = new Error(`Zeitlimit von ${timeoutMs / 1000} Sekunden erreicht. Die JVM wurde beendet.`)
      child.kill('SIGKILL')
    }, timeoutMs)

    function collect(chunk, isError) {
      bytes += Buffer.byteLength(chunk, 'utf8')
      if (bytes > maxOutputBytes) {
        failure = new Error('Zu viel Ausgabe. Die JVM wurde beendet.')
        child.kill('SIGKILL')
        return
      }
      if (isError) errors += chunk.toString('utf8')
      else output += chunk.toString('utf8')
    }

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', chunk => collect(chunk, false))
    child.stderr.on('data', chunk => collect(chunk, true))
    child.on('error', error => {
      clearTimeout(timer)
      reject(error)
    })
    child.stdin.on('error', error => {
      if (error.code !== 'EPIPE') {
        failure = error
        child.kill('SIGKILL')
      }
    })
    child.on('close', exitCode => {
      clearTimeout(timer)
      if (failure) return reject(failure)
      if (exitCode !== 0) {
        return reject(new Error(errors.trim() || `Java wurde mit Exit-Code ${exitCode} beendet.`))
      }
      try {
        resolve(JSON.parse(output))
      }
      catch {
        reject(new Error(`Keine gültige Antwort der JVM: ${errors || output || 'Prozess vorzeitig beendet.'}`))
      }
    })
    child.stdin.end(code)
  })
}

export function javaSandbox({ javaHome } = {}) {
  let busy = false
  return {
    name: 'local-java-sandbox',
    configureServer(server) {
      server.middlewares.use('/__java-sandbox/run', async (req, res) => {
        const reply = (status, body) => {
          res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
          res.end(JSON.stringify(body))
        }
        // No CORS: a custom header and an exact Origin check reject foreign sites.
        const host = req.headers.host
        const localHost = /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host ?? '')
        const origin = `${server.config.server.https ? 'https' : 'http'}://${host}`
        if (!localHost || req.headers.origin !== origin || req.headers['x-java-sandbox'] !== '1') {
          reply(403, { error: 'Nur gleichursprüngliche Anfragen über localhost sind erlaubt.' })
          return
        }
        if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
          reply(400, { error: 'POST mit Content-Type application/json erwartet.' })
          return
        }
        let body = ''
        let bytes = 0
        try {
          req.setEncoding('utf8')
          for await (const chunk of req) {
            bytes += Buffer.byteLength(chunk, 'utf8')
            if (bytes > maxCodeBytes) {
              reply(413, { error: 'Maximal 32 KiB pro Anfrage erlaubt.' })
              return
            }
            body += chunk.toString('utf8')
          }
          let input
          try {
            input = JSON.parse(body)
          }
          catch {
            reply(400, { error: 'Ungültiges JSON.' })
            return
          }
          if (typeof input?.code !== 'string' || !input.code.trim()) {
            reply(400, { error: 'Java-Code fehlt.' })
            return
          }
          if (busy) {
            reply(409, { error: 'Es läuft bereits ein Java-Snippet. Bitte kurz warten.' })
            return
          }
          busy = true
          try {
            reply(200, await runJava(input.code, javaHome || process.env.JAVA_HOME))
          }
          finally {
            busy = false
          }
        }
        catch (error) {
          server.config.logger.error(`[java-sandbox] ${error.message}`)
          reply(500, { error: error.message })
        }
      })
    },
  }
}
