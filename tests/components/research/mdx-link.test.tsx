import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { MdxLink } from '@/components/research/mdx-link'
import { withBasePath } from '@/lib/base-path'

describe('MdxLink', () => {
  afterEach(() => cleanup())

  it('routes internal hrefs through withBasePath', () => {
    const { container } = render(<MdxLink href="/research/x">Link</MdxLink>)
    const anchor = container.querySelector('a')
    expect(anchor?.getAttribute('href')).toBe(withBasePath('/research/x'))
    expect(anchor?.getAttribute('href')).toContain('/research/x')
  })

  it('leaves external hrefs unchanged', () => {
    const { container } = render(<MdxLink href="https://example.com">External</MdxLink>)
    const anchor = container.querySelector('a')
    expect(anchor?.getAttribute('href')).toBe('https://example.com')
  })
})
