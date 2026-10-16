import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { javaSandbox } from './sandbox/server.mjs'
import { discoverJdks, saveJdks } from './sandbox/jdks.mjs'

export default defineConfig(async ({ mode, command }) => {
  const root = fileURLToPath(new URL('.', import.meta.url))
  const env = loadEnv(mode, root, 'JAVA_SANDBOX_')
  const configured = JSON.parse(env.JAVA_SANDBOX_JDKS || '[]')
  if (!Array.isArray(configured) || configured.some(path => typeof path !== 'string')) {
    throw new Error('JAVA_SANDBOX_JDKS muss ein JSON-Array von JDK-Home-Pfaden sein.')
  }
  const jdks = command === 'serve'
    ? await discoverJdks({ configured: [...configured, env.JAVA_SANDBOX_HOME].filter(Boolean) })
    : []
  if (command === 'serve') await saveJdks(`${root}.env.local`, jdks)
  return {
    server: { host: '127.0.0.1' },
    plugins: [javaSandbox({ javaHome: env.JAVA_SANDBOX_HOME, jdks })],
  }
})
