import { MapPageClient } from "@/components/Maps/Page";
import { headers } from "next/headers";
import { checkIsFromSameOrigin } from "@/utils/checkIsFromSameOrigin";

export default async function Page(){
  const sameOrigin = checkIsFromSameOrigin(await headers())
  return (
    <MapPageClient sameOrigin={sameOrigin}/>
  )
}