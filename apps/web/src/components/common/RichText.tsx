import type { ReactNode } from 'react'
import { apiOrigin } from '@/lib/api'

type RichTextNode = {
  type?: string
  root?: {
    children?: RichTextNode[]
  }
  children?: RichTextNode[]
  text?: string
  format?: number | string
  tag?: string
  url?: string
  newTab?: boolean
  listType?: string
  fields?: {
    alt?: string | null
  }
  value?: RichTextNode | number | string | MediaNode
}

type MediaNode = {
  url?: string | null
  alt?: string | null
  filename?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
}

type RichTextProps = {
  content: RichTextNode | null | undefined
  className?: string
}

const formatText = (text: string, format: RichTextNode['format']) => {
  if (typeof format !== 'number') {
    return text
  }

  let result: ReactNode = text

  if (format & 1) result = <strong>{result}</strong>
  if (format & 2) result = <em>{result}</em>
  if (format & 4) result = <s>{result}</s>
  if (format & 8) result = <u>{result}</u>
  if (format & 16) result = <code>{result}</code>
  if (format & 32) result = <sub>{result}</sub>
  if (format & 64) result = <sup>{result}</sup>

  return result
}

const isSafeUrl = (url: string) => {
  if (url.startsWith('/') || url.startsWith('#')) {
    return true
  }

  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

const resolveMediaUrl = (url: string) => {
  if (url.startsWith('/')) {
    return `${apiOrigin}${url}`
  }

  return isSafeUrl(url) ? url : null
}

const renderChildren = (children: RichTextNode[] | undefined, keyPrefix: string) => {
  return children?.map((child, index) => (
    <RichTextNodeView key={`${keyPrefix}-${index}`} node={child} />
  ))
}

function RichTextNodeView({ node }: { node: RichTextNode }) {
  const children = renderChildren(node.children, node.type ?? 'node')

  switch (node.type) {
    case 'text':
      return <>{formatText(node.text ?? '', node.format)}</>
    case 'linebreak':
      return <br />
    case 'heading':
      if (node.tag === 'h1') return <h1 className="mb-4 text-2xl font-bold">{children}</h1>
      if (node.tag === 'h2') return <h2 className="mb-3 text-xl font-bold">{children}</h2>
      if (node.tag === 'h3') return <h3 className="mb-2 text-lg font-bold">{children}</h3>
      if (node.tag === 'h4') return <h4 className="mb-2 font-bold">{children}</h4>
      if (node.tag === 'h5') return <h5 className="mb-2 font-bold">{children}</h5>
      return <h6 className="mb-2 font-bold">{children}</h6>
    case 'list':
      return node.listType === 'number'
        ? <ol className="list-decimal space-y-1 pl-6">{children}</ol>
        : <ul className="list-disc space-y-1 pl-6">{children}</ul>
    case 'listitem':
      return <li>{children}</li>
    case 'quote':
      return <blockquote className="border-l-4 border-black/30 pl-4 italic">{children}</blockquote>
    case 'link': {
      const url = typeof node.url === 'string' && isSafeUrl(node.url) ? node.url : '#'

      return <a className="underline" href={url} target={node.newTab ? '_blank' : undefined} rel={node.newTab ? 'noreferrer' : undefined}>{children}</a>
    }
    case 'upload': {
      if (!node.value || typeof node.value !== 'object' || !('url' in node.value)) {
        return null
      }

      const media = node.value as MediaNode
      const url = typeof media.url === 'string' ? resolveMediaUrl(media.url) : null

      if (!url) {
        return null
      }

      if (!media.mimeType?.startsWith('image/')) {
        return (
          <a className="underline" href={url} rel="noreferrer" target="_blank">
            {media.filename ?? 'ファイルを開く'}
          </a>
        )
      }

      return (
        <img
          src={url}
          alt={node.fields?.alt ?? media.alt ?? ''}
          width={media.width ?? undefined}
          height={media.height ?? undefined}
          className="h-auto max-w-full"
        />
      )
    }
    case 'horizontalrule':
      return <hr />
    default:
      return <>{children}</>
  }
}

export default function RichText({ content, className }: RichTextProps) {
  const children = content?.root?.children

  if (!children?.length) {
    return null
  }

  return (
    <div className={`space-y-4 ${className ?? ''}`}>
      {renderChildren(children, 'root')}
    </div>
  )
}
