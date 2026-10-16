// 岩手県一関市の現在の天気を返す（背景の雨演出用）
// - Open-Meteo（API キー不要）から取得し、10 分間キャッシュする
// - 取得に失敗したときは「雨ではない」として扱う

const ICHINOSEKI = { latitude: 38.9347, longitude: 141.1266 }
const REVALIDATE_SECONDS = 600

// WMO weather code のうち雨に当たるもの（霧雨・雨・着氷性の雨・にわか雨・雷雨）
const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99])

export const revalidate = 600

type OpenMeteoCurrent = {
  current?: {
    rain?: number
    showers?: number
    weather_code?: number
  }
}

export async function GET() {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(ICHINOSEKI.latitude))
  url.searchParams.set('longitude', String(ICHINOSEKI.longitude))
  url.searchParams.set('current', 'rain,showers,weather_code')
  url.searchParams.set('timezone', 'Asia/Tokyo')

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } })
    if (!response.ok) throw new Error(`Open-Meteo responded ${response.status}`)

    const { current } = (await response.json()) as OpenMeteoCurrent
    const isRaining =
      (current?.rain ?? 0) > 0 ||
      (current?.showers ?? 0) > 0 ||
      RAIN_CODES.has(current?.weather_code ?? -1)

    return Response.json(
      { isRaining },
      { headers: { 'cache-control': `public, max-age=${REVALIDATE_SECONDS}` } },
    )
  } catch {
    return Response.json({ isRaining: false })
  }
}
