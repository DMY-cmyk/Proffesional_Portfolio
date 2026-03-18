const isProd = process.env.NODE_ENV === 'production'
export const basePath = isProd ? '/Proffesional_Portfolio' : ''

export function withBasePath(path: string): string {
  if (!path.startsWith('/')) return path
  return `${basePath}${path}`
}
