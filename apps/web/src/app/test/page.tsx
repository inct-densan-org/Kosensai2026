'use client'

import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { client } from '@/lib/api'

type HealthResponse = {
    ok: boolean
    timestamp: string
}

type Message = {
    id: number
    body: string
    createdAt: string
}

type MessageListResponse = {
    messages: Message[]
}

const readJson = async <T,>(response: Response): Promise<T> => {
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json() as Promise<T>
}

export default function HomePage() {
    const [health, setHealth] = useState<HealthResponse | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [body, setBody] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = async () => {
        setError(null)
        setLoading(true)

        try {
            const [healthResult, messagesResult] = await Promise.all([
                client.health.$get(),
                client.messages.$get()
            ])
            const [healthResponse, messageResponse] = await Promise.all([
                readJson<HealthResponse>(healthResult),
                readJson<MessageListResponse>(messagesResult)
            ])

            setHealth(healthResponse)
            setMessages(messageResponse.messages)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'API の読み込みに失敗しました')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void load()
    }, [])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const response = await client.messages.$post({
                json: { body }
            })

            await readJson<{ message: Message }>(response)
            setBody('')
            await load()
        } catch (err) {
            setError(err instanceof Error ? err.message : '投稿に失敗しました')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="page">
            <section className="hero">
                <p className="eyebrow">Kosensai 2026 monorepo</p>
                <h1>Next と Hono を直結し、データは SQLite に集約</h1>
                <p className="lead">
                    フロントからは Hono RPC の型付きクライアント経由で API を叩きます。
                </p>

                <div className="statusCard">
                    <span className="statusLabel">API 状態</span>
                    <strong>{loading ? '読み込み中' : health?.ok ? 'OK' : 'NG'}</strong>
                    {health ? <small>{health.timestamp}</small> : null}
                </div>
            </section>

            <section className="panel">
                <h2>メッセージ送信</h2>
                <form className="form" onSubmit={handleSubmit}>
          <textarea
              value={body}
              onChange={event => setBody(event.target.value)}
              placeholder="API に保存するメッセージ"
              rows={4}
          />
                    <button type="submit" disabled={submitting || !body.trim()}>
                        {submitting ? '送信中' : '送信'}
                    </button>
                </form>
            </section>

            <section className="panel">
                <h2>保存済みメッセージ</h2>
                <ul className="list">
                    {messages.map(message => (
                        <li key={message.id}>
                            <p>{message.body}</p>
                            <small>{message.createdAt}</small>
                        </li>
                    ))}
                </ul>
            </section>

            {error ? <p className="error">{error}</p> : null}
        </main>
    )
}
