import type { AnchorHTMLAttributes } from 'react'
import { withBasePath } from '@/lib/base-path'

/**
 * Anchor renderer for MDXRemote content. Markdown links compile to plain
 * `<a href>` tags, which Next's basePath rewriting never touches (only
 * next/link and router navigation get it). Internal links therefore 404
 * on GitHub Pages, which is served from a `/Proffesional_Portfolio` subpath.
 * This routes internal hrefs (starting with '/') through withBasePath while
 * leaving external and hash links untouched.
 */
export function MdxLink({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const resolvedHref = href && href.startsWith('/') ? withBasePath(href) : href
  return <a href={resolvedHref} {...props} />
}
