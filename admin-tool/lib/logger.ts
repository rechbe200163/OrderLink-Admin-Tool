'use server'
import { appendFile, mkdir } from 'fs/promises'
import { dirname, join } from 'path'

export async function logError(message: string) {
  const logPath = join(process.cwd(), 'logs', 'error.log')
  try {
    await mkdir(dirname(logPath), { recursive: true })
    const timestamp = new Date().toISOString()
    await appendFile(logPath, `[${timestamp}] ${message}\n`)
  } catch (err) {
    console.error('Failed to write log:', err)
  }
}
