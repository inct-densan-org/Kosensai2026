import ScrollToTop from "@/components/top/ScrollToTop";
import Link from "next/link";
import { PageContainer } from "@/components/layout-wrapper";


export default function Navigation({isTop = false}: {isTop?: boolean}) {
    return (
      <PageContainer className="fixed inset-x-0 top-6 z-[201]">
        <nav
            className={"h-12 w-full backdrop-blur-lg border-white border-[1px] rounded-xl flex items-center px-4 gap-2 justify-around"}>
            <Link href={isTop ? "" : "/"} className={" text-md tracking-wider text-white"}
            >{isTop ? <ScrollToTop>HOME</ScrollToTop> : "HOME"}</Link>
            <Link href={"/news"} className={" text-sm tracking-widest text-white "}>NEWS</Link>
            <Link href={"/map"} className={" text-sm tracking-widest text-white"}>MAP</Link>
            <Link href={"/events"} className={" text-sm tracking-wide text-white"}>EVENTS</Link>
        </nav>
      </PageContainer>
    )
}
