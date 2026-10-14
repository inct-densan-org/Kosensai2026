import type { CollectionConfig, Endpoint } from 'payload'
import { APIError } from 'payload'
import { admins } from '@/access/roles'

export const reactionTargetTypes = [
  'news-articles',
  'blog-articles',
  'shop-announcements',
] as const

export type ReactionTargetType = (typeof reactionTargetTypes)[number]

const isReactionTargetType = (value: unknown): value is ReactionTargetType => {
  return typeof value === 'string' && reactionTargetTypes.includes(value as ReactionTargetType)
}

const readValue = (value: unknown) => {
  return typeof value === 'string' ? value.trim() : ''
}

const readTarget = (value: unknown) => {
  const target = value as Record<string, unknown> | null
  const contentType = target?.contentType
  const contentId = readValue(target?.contentId)
  const reactionKey = readValue(target?.reactionKey)
  const visitorId = readValue(target?.visitorId)

  if (!isReactionTargetType(contentType) || !contentId || !reactionKey || !visitorId) {
    throw new APIError('リアクションの入力が不正です', 400)
  }

  if (contentId.length > 100 || reactionKey.length > 100 || visitorId.length > 200) {
    throw new APIError('リアクションの入力が長すぎます', 400)
  }

  return { contentType, contentId, reactionKey, visitorId }
}

const assertPublishedTarget = async (
  req: Parameters<NonNullable<Endpoint['handler']>>[0],
  contentType: ReactionTargetType,
  contentId: string,
) => {
  try {
    await req.payload.findByID({
      collection: contentType,
      id: contentId,
      depth: 0,
      overrideAccess: false,
    })
  } catch {
    throw new APIError('対象の記事が見つかりません', 404)
  }
}

const getReactionDefinitions = async (req: Parameters<NonNullable<Endpoint['handler']>>[0]) => {
  const result = await req.payload.find({
    collection: 'reaction-definitions',
    where: { enabled: { equals: true } },
    sort: 'sortOrder',
    limit: 100,
    overrideAccess: true,
  })

  return result.docs
}

const countReaction = async (
  req: Parameters<NonNullable<Endpoint['handler']>>[0],
  contentType: ReactionTargetType,
  contentId: string,
  reactionKey: string,
) => {
  const result = await req.payload.count({
    collection: 'content-reactions',
    where: {
      and: [
        { contentType: { equals: contentType } },
        { contentId: { equals: contentId } },
        { reactionKey: { equals: reactionKey } },
      ],
    },
    overrideAccess: true,
  })

  return result.totalDocs
}

const findVisitorReaction = async (
  req: Parameters<NonNullable<Endpoint['handler']>>[0],
  contentType: ReactionTargetType,
  contentId: string,
  reactionKey: string,
  visitorId: string,
) => {
  const result = await req.payload.find({
    collection: 'content-reactions',
    where: {
      and: [
        { contentType: { equals: contentType } },
        { contentId: { equals: contentId } },
        { reactionKey: { equals: reactionKey } },
        { visitorId: { equals: visitorId } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  return result.docs[0] ?? null
}

const getReactions: Endpoint['handler'] = async (req) => {
  const searchParams = new URL(req.url ?? 'http://localhost').searchParams
  const contentType = searchParams.get('contentType')
  const contentId = readValue(searchParams.get('contentId'))
  const visitorId = readValue(req.headers.get('x-reaction-visitor-id'))

  if (!isReactionTargetType(contentType) || !contentId) {
    return Response.json({ error: 'リアクション対象の指定が不正です' }, { status: 400 })
  }

  await assertPublishedTarget(req, contentType, contentId)
  const definitions = await getReactionDefinitions(req)
  const reactions = await Promise.all(definitions.map(async (definition) => {
    const [count, visitorReaction] = await Promise.all([
      countReaction(req, contentType, contentId, definition.key),
      visitorId
        ? findVisitorReaction(req, contentType, contentId, definition.key, visitorId)
        : Promise.resolve(null),
    ])

    return {
      key: definition.key,
      emoji: definition.emoji,
      count,
      active: Boolean(visitorReaction),
    }
  }))

  return Response.json({ reactions })
}

const toggleReaction: Endpoint['handler'] = async (req) => {
  if (!req.json) {
    throw new APIError('リクエスト本文を読み取れません', 400)
  }

  const data = readTarget(await req.json())
  await assertPublishedTarget(req, data.contentType, data.contentId)

  const definitions = await req.payload.find({
    collection: 'reaction-definitions',
    where: {
      and: [
        { key: { equals: data.reactionKey } },
        { enabled: { equals: true } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  })

  if (!definitions.docs[0]) {
    throw new APIError('そのリアクションは現在利用できません', 404)
  }

  const fingerprint = [data.contentType, data.contentId, data.reactionKey, data.visitorId].join(':')
  const existing = await findVisitorReaction(
    req,
    data.contentType,
    data.contentId,
    data.reactionKey,
    data.visitorId,
  )
  let active = true

  if (existing) {
    await req.payload.delete({
      collection: 'content-reactions',
      id: existing.id,
      overrideAccess: true,
    })
    active = false
  } else {
    try {
      await req.payload.create({
        collection: 'content-reactions',
        data: {
          contentType: data.contentType,
          contentId: data.contentId,
          reactionKey: data.reactionKey,
          visitorId: data.visitorId,
          fingerprint,
        },
        overrideAccess: true,
      })
    } catch (error) {
      const racedReaction = await findVisitorReaction(
        req,
        data.contentType,
        data.contentId,
        data.reactionKey,
        data.visitorId,
      )

      if (!racedReaction) throw error
    }
  }

  return Response.json({
    active,
    count: await countReaction(req, data.contentType, data.contentId, data.reactionKey),
  })
}

export const reactionEndpoints: Endpoint[] = [
  {
    path: '/reactions',
    method: 'get',
    handler: getReactions,
  },
  {
    path: '/reactions',
    method: 'post',
    handler: toggleReaction,
  },
]

export const ReactionDefinitions: CollectionConfig = {
  slug: 'reaction-definitions',
  admin: {
    useAsTitle: 'emoji',
    defaultColumns: ['emoji', 'key', 'enabled', 'sortOrder'],
  },
  access: {
    create: admins,
    read: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'APIで使う一意なキー。作成後は変更しないでください。',
      },
    },
    {
      name: 'emoji',
      type: 'text',
      required: true,
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
}

export const ContentReactions: CollectionConfig = {
  slug: 'content-reactions',
  admin: {
    useAsTitle: 'fingerprint',
    defaultColumns: ['contentType', 'contentId', 'reactionKey', 'createdAt'],
  },
  access: {
    create: admins,
    read: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'contentType',
      type: 'select',
      required: true,
      options: reactionTargetTypes.map(value => ({ label: value, value })),
    },
    {
      name: 'contentId',
      type: 'text',
      required: true,
    },
    {
      name: 'reactionKey',
      type: 'text',
      required: true,
    },
    {
      name: 'visitorId',
      type: 'text',
      required: true,
    },
    {
      name: 'fingerprint',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
  ],
}
