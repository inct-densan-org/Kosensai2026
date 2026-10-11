import HeroPC from "./HeroPC";
import HeroScroll from "./HeroScroll";
import TopBar from "@/components/common/TopBar";
import BackToTopButton from "@/components/common/BackToTopButton";
import { PAGE_BACKGROUND } from "@/components/common/pageLayout";
import ContentCard from "@/components/common/ContentCard";
import TopSection, { screensHeight } from "./TopSection";

export function TopPageClient() {
  return (
    <main className="relative w-full">
      <HeroPC id="hero" />
      <HeroScroll heroId="hero" />

      {/* ヒーローより下の画面: スクロールするとトップバーが画面上部に固定される */}
      <div
        className="home-tech-background relative min-h-dvh w-full"
        style={{ backgroundColor: PAGE_BACKGROUND }}
      >
        <TopBar current="HOME" />

        {/* 各項目（screens: 確保する高さ。画面何枚分か） */}
        <TopSection id="greeting" title="ごあいさつ" screens={1.5}>
          <div className="mx-auto max-w-3xl space-y-6">
            <ContentCard as="section" circuitReveal>
              <div className="mb-6">
                <span className="mb-3 inline-block rounded bg-sky-100/80 px-2.5 py-1 text-xs font-bold tracking-wider text-sky-800 uppercase">
                  WELCOME!! 校長挨拶
                </span>

                <div className="flex items-center gap-4 md:gap-6">
                  <img
                    src="/img/top/President.png"
                    alt="校長写真"
                    className="h-20 w-20 shrink-0 rounded-full border-2 border-white object-cover object-top shadow-sm md:h-24 md:w-24"
                  />
                  <div>
                    <h3 className="text-balance text-lg font-bold text-gray-800 md:text-xl">
                      ようこそ高専祭へ
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 md:text-base">
                      一関高専校長 <span className="ml-1 font-bold text-gray-800">小林 淳哉</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-pretty text-sm leading-relaxed text-gray-700 [line-break:strict] md:text-base">
                <p>
                  高専祭は、本校の教育の成果を発表し、地域の方々との交流を深める絶好の機会です。
                </p>
                <p>
                  先日の熊本地震では、熊本高専にも大きな被害が出ました。私たちが当たり前のように学び、活動できる日常もまた、こうした災害と背中合わせであることに、
                  <span className="whitespace-nowrap">東日本大震災</span>
                  を経験した私たちも改めて気付かされました。そこで今年は、
                  <span className="whitespace-nowrap">熊本地震支援バザー</span>
                  や献血も企画しました。
                </p>
                <p>
                  もちろん、例年以上に多彩な屋台や企画も充実しています。このほか、全国の高専の中でも強豪として知られるロボコンの活動、科学に親しめる
                  <span className="whitespace-nowrap">サイエンスカフェ</span>
                  、地域の課題の解決を目指した学生の取り組みなど、日頃の活動の成果を展示・発表します。また、教員による研究発表も行われますので、先進的な研究を通して、科学技術や工学への興味を一層深めていただけるものと思います。
                </p>
                <p>
                  さまざまな企画を通して、学生の明るく熱意あふれる姿をぜひご覧ください。皆様とともに、楽しい時間を過ごせれば幸いです。
                </p>
              </div>
            </ContentCard>

            <ContentCard as="section" circuitReveal>
              <div className="mb-6">
                <span className="mb-3 inline-block rounded bg-sky-100/80 px-2.5 py-1 text-xs font-bold tracking-wider text-sky-800 uppercase">
                  MESSAGE 代表挨拶
                </span>

                <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 md:grid-cols-[6rem_minmax(0,1fr)] md:grid-rows-2 md:gap-x-6 md:gap-y-1">
                  <img
                    src="/img/top/Image.png"
                    alt="実行委員長写真"
                    className="col-start-1 row-start-2 aspect-square h-20 w-20 shrink-0 rounded-full border-2 border-white object-cover shadow-sm md:row-span-2 md:row-start-1 md:h-24 md:w-24"
                  />
                  <h3 className="col-span-2 row-start-1 text-balance text-lg font-bold text-gray-800 md:col-span-1 md:col-start-2 md:text-xl">
                    <span className="block md:inline">青春は timeless</span>{" "}
                    <span>～今しかない、この瞬間を～</span>
                  </h3>
                  <p className="col-start-2 row-start-2 mt-1 text-sm text-gray-600 md:row-start-2 md:text-base">
                    高専祭実行委員長 <span className="ml-1 font-bold text-gray-800">黒澤 陽季</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-pretty text-sm leading-relaxed text-gray-700 [line-break:strict] md:text-base">
                <p>
                  <span className="block md:inline">皆さんこんにちは！！</span>
                  <span>実行委員長の黒澤陽季です。</span>
                </p>
                <p>
                  今年度の高専祭もたくさんの人々のご協力のもと、無事開催できたことをとてもうれしく思います。私たち実行委員会は、来場してくださった皆さんに限りなく楽しんでいただきたく、様々な企画や運営に関わる準備をしてきました。
                </p>
                <p>
                  今回の高専祭のテーマは「
                  <span className="whitespace-nowrap">青春は timeless～今しかない</span>
                  、この瞬間を～」です。青春とは
                  <span className="whitespace-nowrap">学生時代</span>
                  だけを指すものではなく、何かに夢中になり、人と出会い、同じ時間を共有するすべての瞬間に存在するものだと思います。高専祭という特別な二日間で、学生たちはもちろん、ご来場いただいた皆さんにも笑顔や感動、新たな発見を通して”今しかない、この瞬間”を楽しんでいただきたいという思いを、このテーマに込めました。
                </p>
                <p>
                  今年も学科展示や屋台、ステージ企画など、学生たちが力を合わせて準備してきた企画を数多くご用意しております。また、新たな取り組みとして献血活動や熊本地震支援バザーを実施します。高専祭を楽しむだけでなく、人とのつながりや社会貢献について考えるきっかけになれば幸いです。
                </p>
                <p>この二日間を最大限にお楽しみください。</p>
              </div>
            </ContentCard>
          </div>
        </TopSection>
        <TopSection id="news" title="ニュース" screens={1} />
        <TopSection id="access" title="アクセス" screens={2} />
        <TopSection id="stalls" title="屋台" screens={1} />
        <TopSection id="sponsors" title="協賛" screens={0.5} />

        {/* フッター（見出しなし・0.5画面） */}
        <footer className="w-full" style={{ minHeight: screensHeight(0.5) }} />
      </div>

      {/* ページの一番下まで来たら右下に表示する、最上部へ戻るボタン */}
      <BackToTopButton />
    </main>
  );
}
