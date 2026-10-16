import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ContentCard from "@/components/common/ContentCard";
import { notoSansJP } from "@/components/common/fonts";
import { postersData } from "@/posters.data";

const NOTICES = [
  "敷地内は禁煙となっております。喫煙はご遠慮ください。",
  "ゴミは各所に設置のゴミ箱へお捨てください。分別指示に沿ったゴミ箱に廃棄されますようお願いいたします。",
  "（お車でお越しの来場者様へ）高専祭期間中、構内の車道は一方通行となります。誘導員の指示に従い、徐行をお願いいたします。",
  "歩きながらのスマートフォン操作（歩きスマホ）は危険ですので、ご遠慮ください。",
  "荷物や貴重品の管理には十分ご注意ください。落とし物は受付でお預かりいたします。",
  "迷子を見かけた際は受付までお知らせください。",
];

const WIFI_TERMS = [
  "Wi-Fiを利用しての法令・公序良俗に反する行為はおやめください。",
  "問題行動に対しては、当該機器の通信を遮断する場合がございます。",
  "運用上、必要なログやデータの収集を行います。収集したログ・データを利用して情報共有を行う場合は、個人を識別できない形で行います。",
  "本ネットワークの利用により発生した損失・損害等につきましては、一切の責任を負いかねます。",
];

function NoticeSectionCard({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <ContentCard as="section" aria-labelledby={`${id}-heading`} className="min-w-0">
      <h3 id={`${id}-heading`} className="m-0 mb-4 text-lg font-bold leading-snug md:text-xl">
        {title}
      </h3>
      <div className="space-y-4 text-pretty text-sm leading-[1.8] [line-break:strict] md:text-base">
        {children}
      </div>
    </ContentCard>
  );
}

export default function VariousNoticeSection() {
  const bloodDonation = postersData.find((shop) => shop.mapId === 58);

  return (
    <div className={`${notoSansJP.className} space-y-8 text-left text-[#1f3a4a]`}>
      {bloodDonation && (
        <NoticeSectionCard id="blood-donation" title={bloodDonation.title}>
          <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
            <Image
              src="/img/top/blood-donation.png"
              alt="高専祭の献血案内。2026年10月24日（土）、一関工業高等専門学校。受付時間は10:00〜12:00、13:30〜16:00。"
              width={1714}
              height={1527}
              sizes="(min-width: 960px) 420px, (min-width: 768px) calc((100vw - 152px) / 2), calc(100vw - 80px)"
              className="h-auto w-full rounded-lg"
            />
            <div className="flex flex-col items-start gap-5">
              <div>
                <p className="m-0 mb-2 text-sm font-bold text-[#2f7f9c]">実行委員コメント</p>
                <p className="m-0 whitespace-pre-line">{bloodDonation.desc}</p>
              </div>
              <Link
                href={`/shops/${bloodDonation.mapId}/detail`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2f7f9c] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1f6077] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2f7f9c]"
              >
                献血の詳細を見る
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </NoticeSectionCard>
      )}

      {/* 昨年度と同じく、スマホでは縦並び、md 以上では注意事項・Wi-Fi の順に横並びにする */}
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-10">
        <NoticeSectionCard id="visitor-notices" title="注意事項について">
          <ul className="m-0 list-outside list-disc space-y-2 pb-3 pl-5 marker:text-[#2f7f9c]">
            {NOTICES.map((notice) => <li key={notice}>{notice}</li>)}
          </ul>

          <section aria-labelledby="emergency-heading" className="border-t border-[#1f3a4a]/15 pt-5">
            <h4 id="emergency-heading" className="m-0 mb-2 font-bold">緊急時の対応について</h4>
            <p className="m-0">
              地震・火災などの緊急時は、落ち着いて実行委員・教職員の指示に従い、避難・待機してください。会場や状況により対応が異なる場合があります。
            </p>
            <details className="mt-4 rounded-lg border border-[#1f3a4a]/15 bg-white/30 p-4">
              <summary className="cursor-pointer font-bold text-[#2f7f9c] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2f7f9c]">
                詳しい対応を確認する
              </summary>
              <dl className="m-0 mt-4 space-y-4">
                <div>
                  <dt className="font-bold">体育館での停電時</dt>
                  <dd className="m-0 mt-1">
                    アナウンスに従い、その場で待機してください。係員による誘導がある場合は、その指示に従ってください。復旧までプログラムが一時中断となる場合があります。
                  </dd>
                </div>
                <div>
                  <dt className="font-bold">体育館で傷病人が発生した場合</dt>
                  <dd className="m-0 mt-1">
                    実行委員の案内に従い、通路の確保にご協力ください。救急対応のため移動の指示があった場合は、その指示に従ってください。
                  </dd>
                </div>
                <div>
                  <dt className="font-bold">花火会場で負傷者が発生した場合</dt>
                  <dd className="m-0 mt-1">
                    必要に応じて打ち上げを中止します。指示があるまでその場で待機し、誘導があれば従ってください。救急車が入る場合は、通路の確保にご協力ください。
                  </dd>
                </div>
              </dl>
            </details>
          </section>
        </NoticeSectionCard>

        <NoticeSectionCard id="free-wifi" title="フリーWi-Fiの提供について">
          <p className="m-0">今年度の高専祭では、有志学生チームによるフリーWi-Fiの提供を行っております！</p>
          <p className="m-0">
            接続に関する情報、及びトラブル時の連絡先につきましては、受付にて配布されますパンフレットの物理媒体、または校内にて掲示中のポスターをご参照くださいませ。
          </p>
          <div>
            <h4 className="m-0 font-bold">規約</h4>
            <ul className="m-0 mt-2 list-outside list-disc space-y-2 pl-5 marker:text-[#2f7f9c]">
              {WIFI_TERMS.map((term) => <li key={term}>{term}</li>)}
            </ul>
          </div>
          <Image
            src="/img/top/noc-nitic.webp"
            alt="NOC NITIC。"
            width={1024}
            height={1280}
            sizes="(min-width: 768px) 320px, calc(100vw - 80px)"
            className="mx-auto h-auto w-full max-w-xs rounded-lg"
          />
        </NoticeSectionCard>
      </div>
    </div>
  );
}
