import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { shops } from '../src/data/shops'

const payload = await getPayload({ config })

try {
  let created = 0
  let updated = 0

  for (const shop of shops) {
    const existing = await payload.find({
      collection: 'shops',
      where: {
        code: {
          equals: shop.code,
        },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'shops',
        id: existing.docs[0].id,
        data: {
          code: shop.code,
          name: shop.name,
        },
        overrideAccess: true,
      })
      updated += 1
      continue
    }

    await payload.create({
      collection: 'shops',
      data: shop,
      overrideAccess: true,
    })
    created += 1
  }

  console.log(`Shops synced: ${created} created, ${updated} updated`)
} finally {
  await payload.destroy()
}
