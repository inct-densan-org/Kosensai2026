import Image, { type StaticImageData } from "next/image";
import { shipporiMincho } from "./fonts";
import schoolBadge from "@public/img/top/schoolbadge1.png";
import densanLogo from "@public/img/top/densan_logo.png";
import gakuseikaiLogo from "@public/img/top/gakuseikai_logo.png";
import instagramLogo from "@public/img/top/Instagram_Glyph_Gradient.png";
import xLogo from "@public/img/top/logo-black.png";

// デザイン基準: 1440 x 1024 の画面で縦幅 256px。
// 寸法は globals.css の --footer-unit（1440x1024 基準の 1px 相当）の倍数で指定し、画面に合わせて拡縮する。
// 組織ごとに「ロゴ（高さ150）＋右側に縦並びの文字」を横に並べる
//   組織名（32）→ 余白12 → OFFICIAL SNS（32）→ 余白12 → SNS アイコン（Instagram 48 / X 40）→ 余白4 → SNS 名
//   組織名・OFFICIAL SNS は SNS アイコン同士の中間（文字の列の中央）に揃える
//   組織名の左下には役割（製作・協力など、24）を添える（役割＋組織名の幅の中心を OFFICIAL SNS の中心に揃える）
//   ロゴの下には余白8を空けて一言（16）を添えられる（ロゴの位置を他の組織と揃えるため、高さには含めない）
// スマホ（512px 未満）では組織を縦に並べる

// 1440x1024 基準の n px
const u = (n: number) => `calc(var(--footer-unit) * ${n})`;

type Sns = {
  label: string;
  logo: StaticImageData;
  // 表示する高さ（1440x1024 基準）
  height: number;
  href?: string;
};

type Organization = {
  name: string;
  role?: string;
  logo: StaticImageData;
  // ロゴを押したときの遷移先
  href?: string;
  // ロゴと文字の列の間隔（1440x1024 基準、既定 16）
  textGap?: number;
  // ロゴの下に添える一言
  note?: string;
  sns: Sns[];
};

// href が未設定のロゴ・SNS はリンクにしない
const ORGANIZATIONS: Organization[] = [
  {
    name: "一関工業高等専門学校",
    logo: schoolBadge,
    href: "https://www.ichinoseki.ac.jp/",
    sns: [
      {
        label: "Instagram",
        logo: instagramLogo,
        height: 48,
        href: "https://www.instagram.com/nitic_official/?utm_source=ig_web_button_share_sheet",
      },
      { label: "Twitter(新X)", logo: xLogo, height: 40, href: "https://x.com/ichinoseki_nct" },
    ],
  },
  {
    name: "電子計算機部",
    role: "製作",
    logo: densanLogo,
    href: "https://inct-densan.club/",
    // ロゴ画像に余白がないため、学生会（画像に余白あり）と見た目の間隔が揃うよう広げる
    textGap: 37,
    note: "展示もやってます！",
    // 電子計算機部は Instagram のアカウントがないため X のみ
    sns: [{ label: "Twitter(新X)", logo: xLogo, height: 40, href: "https://x.com/inct_densan" }],
  },
  {
    name: "学生会",
    role: "協力",
    logo: gakuseikaiLogo,
    sns: [
      { label: "Instagram", logo: instagramLogo, height: 48, href: "https://www.instagram.com/nitic_gakuseikai/" },
      { label: "Twitter(新X)", logo: xLogo, height: 40, href: "https://x.com/gakusei_kosen" },
    ],
  },
];

// 高さの違う Instagram(48) と X(40) の下端・SNS 名の位置を揃えるため、大きい方に合わせる
const SNS_ICON_BOX = 48;

function SnsLink({ label, logo, height, href }: Sns) {
  const content = (
    <>
      <span className="flex items-center justify-center" style={{ height: u(SNS_ICON_BOX) }}>
        <Image
          src={logo}
          alt=""
          sizes="96px"
          className="w-auto"
          style={{ height: u(height) }}
        />
      </span>
      <span className="leading-none whitespace-nowrap" style={{ marginTop: u(4), fontSize: u(16) }}>
        {label}
      </span>
    </>
  );
  const className = "flex flex-col items-center text-inherit no-underline";

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} transition-opacity hover:opacity-70`}>
      {content}
    </a>
  ) : (
    <span className={className}>{content}</span>
  );
}

function OrganizationItem({ name, role, logo, href, textGap = 16, note, sns }: Organization) {
  const logoImage = (
    <Image src={logo} alt={`${name}のロゴ`} sizes="320px" className="block w-auto" style={{ height: u(150) }} />
  );

  return (
    <div className="flex items-center" style={{ gap: u(textGap) }}>
      <div className="relative shrink-0">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="block transition-opacity hover:opacity-70">
            {logoImage}
          </a>
        ) : (
          logoImage
        )}
        {note && (
          <p
            className="absolute top-full left-1/2 m-0 -translate-x-1/2 leading-none whitespace-nowrap"
            style={{ marginTop: u(8), fontSize: u(16) }}
          >
            {note}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center">
        {/* 製作・協力は組織名の左下に添える */}
        <p className="m-0 flex items-end leading-none whitespace-nowrap" style={{ gap: u(8) }}>
          {role && <span style={{ fontSize: u(24) }}>{role}</span>}
          <span style={{ fontSize: u(32) }}>{name}</span>
        </p>

        <p className="m-0 leading-none tracking-[0.04em] whitespace-nowrap" style={{ marginTop: u(12), fontSize: u(32) }}>
          OFFICIAL SNS
        </p>

        {/* 各 SNS の枠を同じ幅にして、アイコン同士の中間が列の中央に来るようにする */}
        <ul className="m-0 grid list-none auto-cols-fr grid-flow-col p-0" style={{ marginTop: u(12), columnGap: u(24) }}>
          {sns.map((item) => (
            <li key={item.label}>
              <SnsLink {...item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      className={`${shipporiMincho.className} flex w-full items-center justify-evenly bg-[#FDFDFD] text-[#1b1f23] max-[512px]:flex-col max-[512px]:items-center max-[512px]:gap-10 max-[512px]:px-6 max-[512px]:py-12`}
      style={{ minHeight: u(256) }}
    >
      {ORGANIZATIONS.map((organization) => (
        <OrganizationItem key={organization.name} {...organization} />
      ))}
    </footer>
  );
}
