import ScrollToTop from "@/components/top/ScrollToTop";
import Link from "next/link";


export default function Navigation({isTop = false}: {isTop?: boolean}) {
    return (
        <nav
            className={"fixed h-12 w-[calc(100%-32px)] mx-4 mt-dvh top-2 z-[201]  backdrop-blur-lg mt-4 border-white border-[1px] rounded-xl flex items-center px-4 gap-2 justify-around "}>
            <Link href={isTop ? "" : "/"} className={" text-md tracking-wider text-white"}
            >{isTop ? <ScrollToTop>HOME</ScrollToTop> : "HOME"}</Link>
            <Link href={"/news"} className={" text-sm tracking-widest text-white "}>NEWS</Link>
            <Link href={"/map"} className={" text-sm tracking-widest text-white"}>MAP</Link>
            <Link href={"/events"} className={" text-sm tracking-wide text-white"}>EVENTS</Link>
        </nav>
    )
}

