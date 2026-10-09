import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export const checkIsFromSameOrigin = (headers: ReadonlyHeaders): boolean => {

    const referer = headers.get('referer')
    const host = headers.get('host')
    const refererHost = referer?.split('/')[2]
    return host === refererHost
}
