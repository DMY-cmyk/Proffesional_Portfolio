import { describe, it, expect, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '@/hooks/use-language'

const wrapper = ({ children }: React.PropsWithChildren) => (
  <LanguageProvider>{children}</LanguageProvider>
)

describe('useLanguage', () => {
  afterEach(() => localStorage.removeItem('lang'))

  it('defaults to en', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.lang).toBe('en')
  })

  it('persists changes and updates the html lang attribute', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    act(() => result.current.setLang('id'))
    expect(result.current.lang).toBe('id')
    expect(localStorage.getItem('lang')).toBe('id')
    expect(document.documentElement.lang).toBe('id')
  })

  it('restores a stored language after mount', () => {
    localStorage.setItem('lang', 'id')
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.lang).toBe('id')
  })
})
