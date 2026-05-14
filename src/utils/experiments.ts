import { cookies } from 'next/headers'

export async function getVariant(flag: string, options: readonly string[], fallback: string) {
  const cookieStore = await cookies()
  const fromCookie = cookieStore.get(`exp_${flag}`)?.value
  if (fromCookie && options.includes(fromCookie)) {
    return fromCookie
  }
  return fallback
}
