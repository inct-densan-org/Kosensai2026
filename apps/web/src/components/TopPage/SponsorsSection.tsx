import Image from "next/image";
import ContentCard from "@/components/common/ContentCard";
import { notoSansJP } from "@/components/common/fonts";

type SponsorImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Sponsor = {
  id: string;
  name: string;
  poster?: SponsorImage;
  logo?: SponsorImage;
  comment?: string;
};

// ポスター・ロゴは public 配下の画像パスと実寸を指定する。未設定の項目は表示しない。
// 扱いが確定してから追記のこと
const SPONSORS: Sponsor[] = [
  {
    id: "a",
    name: "",
  },
];

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <ContentCard
      as="article"
      aria-labelledby={`sponsor-${sponsor.id}-heading`}
      className="min-w-0"
      bodyClassName="flex flex-col items-center gap-5 md:gap-6"
    >
      {sponsor.poster && (
        <Image
          {...sponsor.poster}
          sizes="(min-width: 960px) 420px, (min-width: 768px) calc((100vw - 152px) / 2), calc(100vw - 80px)"
          className="h-auto w-full rounded-lg"
        />
      )}
      {sponsor.logo && (
        <div className="flex h-24 w-full items-center justify-center md:h-28">
          <Image
            {...sponsor.logo}
            sizes="(min-width: 768px) 256px, min(256px, calc(100vw - 80px))"
            className="max-h-full w-auto max-w-full object-contain md:max-w-64"
          />
        </div>
      )}
      <h3
        id={`sponsor-${sponsor.id}-heading`}
        className="m-0 text-center text-lg font-bold leading-snug md:text-xl"
      >
        {sponsor.name}
      </h3>
      {sponsor.comment && (
        <p className="m-0 w-full whitespace-pre-line text-pretty text-sm leading-[1.8] [line-break:strict] md:text-base">
          {sponsor.comment}
        </p>
      )}
    </ContentCard>
  );
}

export default function SponsorsSection({ sponsors = SPONSORS }: { sponsors?: Sponsor[] }) {
  return (
    <div className={`${notoSansJP.className} grid grid-cols-1 items-start gap-8 text-[#1f3a4a] md:grid-cols-2 md:gap-10`}>
      {sponsors.map((sponsor) => <SponsorCard key={sponsor.id} sponsor={sponsor} />)}
    </div>
  );
}
