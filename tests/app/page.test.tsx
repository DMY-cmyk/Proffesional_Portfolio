import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

// Mock next/dynamic to resolve imports asynchronously with React re-render
vi.mock('next/dynamic', () => {
  const React = require('react')
  return {
    default: (importFn: () => Promise<any>, opts?: any) => {
      return function DynamicWrapper(props: any) {
        const [Component, setComponent] = React.useState<any>(null)
        React.useEffect(() => {
          importFn().then((mod: any) => {
            setComponent(() => mod.default || mod)
          })
        }, [])
        if (Component) return <Component {...props} />
        if (opts?.loading) return opts.loading()
        return null
      }
    },
  }
})

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

import Home from '@/app/page'

describe('Home page', () => {
  it('renders the hero section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('hero')).toBeInTheDocument()
    })
  })

  it('renders the about section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('about')).toBeInTheDocument()
    })
  })

  it('renders the experience section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('experience')).toBeInTheDocument()
    })
  })

  it('renders the certifications section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('certifications')).toBeInTheDocument()
    })
  })

  it('renders the skills section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('skills')).toBeInTheDocument()
    })
  })

  it('renders the contact section', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(document.getElementById('contact')).toBeInTheDocument()
    })
  })
})