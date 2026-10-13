'use client'

import { HeartPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchReactions, type ReactionItem, type ReactionTargetType } from '@/lib/reactions'

type ReactionSummaryProps = {
  contentType: ReactionTargetType
  contentId: string | number
}

export default function ReactionSummary({ contentType, contentId }: ReactionSummaryProps) {
  const [reactions, setReactions] = useState<ReactionItem[]>([])

  useEffect(() => {
    let active = true

    fetchReactions(contentType, String(contentId))
      .then((data) => {
        if (active) setReactions(data.reactions)
      })
      .catch(() => {
        if (active) setReactions([])
      })

    return () => {
      active = false
    }
  }, [contentId, contentType])

  const visibleReactions = reactions.filter((reaction) => reaction.count > 0)

  return (
    <div className="flex min-h-7 items-center gap-1.5" aria-label="リアクション">
      {visibleReactions.length > 0 ? visibleReactions.map((reaction) => (
        <span
          key={reaction.key}
          className="inline-flex items-center gap-1 rounded-full border border-[#9AC7D6] bg-[#dcecf0] px-2 py-1 text-xs font-bold leading-none text-[#1f3a4a]"
          title={`${reaction.emoji} ${reaction.count}件`}
        >
          <span aria-hidden>{reaction.emoji}</span>
          <span className="tabular-nums">{reaction.count}</span>
        </span>
      )) : (
        <HeartPlus className="text-[#287c95]/60" size={17} strokeWidth={1.8} aria-hidden />
      )}
    </div>
  )
}
