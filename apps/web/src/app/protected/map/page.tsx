import { MapPageClient } from "@/components/Maps/Page";
import { headers } from "next/headers";
import { checkIsFromSameOrigin } from "@/utils/checkIsFromSameOrigin";
import { getLatestShopAnnouncements } from "@/lib/shops";

export default async function Page(){
  const sameOrigin = checkIsFromSameOrigin(await headers())
  const latestShopAnnouncements = await getLatestShopAnnouncements().catch(() => ({}))
  return (
    <MapPageClient sameOrigin={sameOrigin} latestShopAnnouncements={latestShopAnnouncements}/>
  )
}
