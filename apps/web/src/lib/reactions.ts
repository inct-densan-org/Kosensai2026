export const reactionTargetTypes = [
  'news-articles',
  'blog-articles',
  'shop-announcements',
] as const

export type ReactionTargetType = (typeof reactionTargetTypes)[number]

export type ReactionItem = {
  key: string
  emoji: string
  count: number
  active: boolean
}

type ReactionResponse = {
  reactions: ReactionItem[]
}

const visitorStorageKey = 'kosensai-reaction-visitor-id'

const getVisitorId = () => {
  const current = window.localStorage.getItem(visitorStorageKey)
  if (current) return current

  const visitorId = crypto.randomUUID()
  window.localStorage.setItem(visitorStorageKey, visitorId)
  return visitorId
}

export const getReactionVisitorId = getVisitorId

export async function fetchReactions(contentType: ReactionTargetType, contentId: string) {
  const params = new URLSearchParams({ contentType, contentId })
  const response = await fetch(`/api/reactions?${params.toString()}`, {
    headers: {
      'x-reaction-visitor-id': getVisitorId(),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Reactions request failed: ${response.status}`)
  }

  return await response.json() as ReactionResponse
}

export async function toggleReaction(
  contentType: ReactionTargetType,
  contentId: string,
  reactionKey: string,
) {
  const response = await fetch('/api/reactions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-reaction-visitor-id': getVisitorId(),
    },
    body: JSON.stringify({
      contentType,
      contentId,
      reactionKey,
      visitorId: getVisitorId(),
    }),
  })

  if (!response.ok) {
    throw new Error(`Reactions request failed: ${response.status}`)
  }

  return await response.json() as { active: boolean; count: number }
}
