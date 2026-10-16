import { runDevJava } from './devjava.mjs'

export const devJavaUrl = 'https://dev.java/playground/'
export const almanacUrl = 'https://javaalmanac.io/jdk/28/'

export function validateExternal(input) {
  const provider = input.provider ?? devJavaUrl
  if (![devJavaUrl, almanacUrl].includes(provider)) throw new Error('Unbekannter externer Anbieter.')
  if (input.preview !== undefined && typeof input.preview !== 'boolean') throw new Error('preview muss ein Boolean sein.')
  if (provider === devJavaUrl && input.preview === false) {
    throw new Error('dev.java aktiviert Preview fest; zum Abschalten ein lokales JDK oder Java Almanac wählen.')
  }
  return provider
}

export async function runExternal(code, { provider = devJavaUrl, preview = true } = {}, fetcher = fetch) {
  validateExternal({ provider, preview })
  if (provider === devJavaUrl) return runDevJava(code, fetcher)
  const imports = []
  const statements = code.replace(/^[ \t]*import\s+(?:static\s+)?[\w.*]+\s*;[ \t]*$/gm, line => {
    imports.push(line)
    return ''
  })
  const source = `${imports.join('\n')}\nclass Sandbox {\npublic static void main(String[] args) throws Exception {\n${statements}\n}\n}`
  const response = await fetcher('https://sandbox.javaalmanac.io/jdk/28/runfromsource', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mainclass: 'Sandbox.java', preview,
      sourcefiles: [{ name: 'Sandbox.java', content: source }],
    }),
    signal: AbortSignal.timeout(20_000),
  })
  if (!response.ok) throw new Error(`Java Almanac antwortet mit HTTP ${response.status}.`)
  const result = await response.json()
  if (typeof result?.output !== 'string' || typeof result.compilesuccess !== 'boolean'
      || (result.compilesuccess && typeof result.runstatus !== 'number')) {
    throw new Error('Unerwartetes Antwortformat von Java Almanac.')
  }
  return {
    ok: result.compilesuccess && result.runstatus === 0,
    runtime: 'Java Almanac · JDK 28',
    output: result.output,
  }
}
