'use client'

import { useEffect, useState } from 'react'
import { HeartPlus } from 'lucide-react'
import {
  fetchReactions,
  toggleReaction,
  type ReactionItem,
  type ReactionTargetType,
} from '@/lib/reactions'

type ReactionBarProps = {
  contentType: ReactionTargetType
  contentId: string | number
}

export default function ReactionBar({ contentType, contentId }: ReactionBarProps) {
  const [reactions, setReactions] = useState<ReactionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    let active = true

    fetchReactions(contentType, String(contentId))
      .then((data) => {
        if (active) setReactions(data.reactions)
      })
      .catch(() => {
        if (active) setReactions([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [contentId, contentType])

  const handleClick = async (reactionKey: string) => {
    if (pendingKey) return

    setPickerOpen(false)
    setPendingKey(reactionKey)
    try {
      const result = await toggleReaction(contentType, String(contentId), reactionKey)
      setReactions((current) => current.map((reaction) => (
        reaction.key === reactionKey
          ? { ...reaction, active: result.active, count: result.count }
          : reaction
      )))
    } finally {
      setPendingKey(null)
    }
  }

  if (loading) {
    return null
  }

  const visibleReactions = reactions.filter((reaction) => reaction.count > 0 || reaction.active)

  return (
    <section className="border-t border-[#9AC7D6]/70 pt-6" aria-label="リアクション">
      <div className="relative flex flex-wrap gap-2">
        {visibleReactions.map((reaction) => (
          <button
            key={reaction.key}
            type="button"
            aria-label={`${reaction.emoji} ${reaction.count}件`}
            aria-pressed={reaction.active}
            disabled={pendingKey !== null}
            onClick={() => handleClick(reaction.key)}
            title={`${reaction.emoji} ${reaction.count}件`}
            className={`inline-flex min-h-9 items-center gap-1.5 border px-2.5 py-1 text-sm transition-colors disabled:cursor-wait disabled:opacity-60 ${
              reaction.active
                ? 'border-[#287c95] bg-[#287c95] text-white'
                : 'border-[#9AC7D6] bg-[#dcecf0] text-[#1f3a4a] hover:bg-white'
            }`}
          >
            <span aria-hidden>{reaction.emoji}</span>
            <span className="tabular-nums opacity-70">{reaction.count}</span>
          </button>
        ))}

        <button
          type="button"
          aria-label="リアクションを追加"
          aria-expanded={pickerOpen}
          aria-haspopup="menu"
          disabled={pendingKey !== null || reactions.length === 0}
          onClick={() => setPickerOpen((open) => !open)}
          className="inline-flex size-9 items-center justify-center rounded-full border border-[#9AC7D6] bg-[#dcecf0] p-0 text-[#1f3a4a] transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-60"
          title="リアクションを追加"
        >
          <HeartPlus className="text-black" size={19} strokeWidth={2} aria-hidden />
        </button>

        {pickerOpen && (
          <div
            role="menu"
            aria-label="リアクションを選択"
            className="absolute left-0 top-full z-10 mt-2 grid grid-cols-6 gap-1 border border-[#9AC7D6] bg-[#f7fcfd] p-2 shadow-lg"
          >
            {reactions.map((reaction) => (
              <button
                key={reaction.key}
                type="button"
                role="menuitem"
                aria-label={reaction.emoji}
                title={reaction.emoji}
                disabled={pendingKey !== null}
                onClick={() => handleClick(reaction.key)}
                className="flex size-9 items-center justify-center rounded-full border border-[#9AC7D6] bg-[#dcecf0] p-0 text-lg text-[#1f3a4a] transition-colors hover:bg-[#9AC7D6] disabled:cursor-wait disabled:opacity-60"
              >
                {reaction.emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
