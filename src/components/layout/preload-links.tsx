import { withBasePath } from '@/lib/base-path'

export function PreloadLinks() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preload" as="image" type="image/jpeg" href={withBasePath('/images/profile/avatar.jpg')} />
    </>
  )
}
