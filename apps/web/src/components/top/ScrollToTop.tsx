"use client"

export default function ScrollToTop({children}: { children: React.ReactNode }) {
    "use client";
    return (
        <span
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            className={"cursor-pointer w-full h-full flex items-center"}>
            {children}
        </span>
    )
}