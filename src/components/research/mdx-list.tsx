import type { HTMLAttributes, OlHTMLAttributes } from 'react'

// WebKit drops the implicit list role when list-style is none (the
// .article-body gold-numeral treatment) — explicit roles keep VoiceOver
// announcing "list, N items".
export function MdxOl(props: OlHTMLAttributes<HTMLOListElement>) {
  return <ol role="list" {...props} />
}

export function MdxUl(props: HTMLAttributes<HTMLUListElement>) {
  return <ul role="list" {...props} />
}
