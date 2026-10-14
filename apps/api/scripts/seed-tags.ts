import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { tags } from '../src/data/tags'

const payload = await getPayload({ config })

try {
  let created = 0
  let updated = 0

  for (const tag of tags) {
    const existing = await payload.find({
      collection: 'tags',
      where: {
        name: {
          equals: tag.name,
        },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'tags',
        id: existing.docs[0].id,
        data: tag,
        overrideAccess: true,
      })
      updated += 1
      continue
    }

    await payload.create({
      collection: 'tags',
      data: tag,
      overrideAccess: true,
    })
    created += 1
  }

  console.log(`Tags synced: ${created} created, ${updated} updated`)
} finally {
  await payload.destroy()
}
