export interface ExternalProvider {
  label: string
  url: string
  proxyUrl?: string
}

const knownUrls = ['https://dev.java/playground/', 'https://javaalmanac.io/jdk/28/']

export function parseProviders(value?: string): ExternalProvider[] {
  const entries: unknown = JSON.parse(value || JSON.stringify([
    { label: 'dev.java', url: knownUrls[0] },
    { label: 'Java Almanac · JDK 28', url: knownUrls[1] },
  ]))
  if (!Array.isArray(entries)) throw new Error('VITE_JAVA_SANDBOX_PROVIDERS muss ein JSON-Array sein.')
  return entries.map(entry => {
    if (!entry || typeof entry !== 'object' || typeof entry.label !== 'string'
        || typeof entry.url !== 'string' || !knownUrls.includes(entry.url)
        || (entry.proxyUrl !== undefined && (typeof entry.proxyUrl !== 'string'
          || !/^https?:\/\//.test(entry.proxyUrl)))) {
      throw new Error('Ungültiger Sandbox-Anbieter: label, unterstützte url und optional HTTP(S) proxyUrl erwartet.')
    }
    return { label: entry.label, url: entry.url, proxyUrl: entry.proxyUrl }
  })
}
