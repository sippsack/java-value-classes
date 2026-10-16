import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { javaSandbox } from './sandbox/server.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), 'JAVA_SANDBOX_')
  return {
    server: { host: '127.0.0.1' },
    plugins: [javaSandbox({ javaHome: env.JAVA_SANDBOX_HOME })],
  }
})
