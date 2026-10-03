import {CSSProperties, ReactNode} from "react";
import {cn} from "@/lib/utils";

export function Window({title, children, color, subtitle, className, titleAction}: {
    title: ReactNode,
    children: ReactNode,
    color?: CSSProperties["color"],
    subtitle?: string,
    className?: string,
    titleAction?: ReactNode
}) {
    return (
        <div className={cn(
            "font-['Mplus 1p'] md:text-[1.2rem] text-white",
            "bg-[rgba(255,255,255,0.2)] backdrop-blur-2xl",
            "border-white border-[1px] rounded-sm z-[200]",
            "flex flex-col",
            className
        )}
             style={{color: color}}>

            {/* Title Bar (fixed height) */}
            <div
                className={"px-3 w-full h-fit rounded-t-sm border-b-white border-[1px] font-bold flex flex-row items-end gap-2 flex-shrink-0"}>
                <h3 className={"md:text-[1.2rem]"}>{title}</h3>
                {titleAction}
                {subtitle && <p className={"pb-[.2em] pl-[2%] text-[.6em] md:text-[.9rem] md:pb-0 font-normal"}>{subtitle}</p>}
            </div>
            
            <div className={"px-4 pt-2 pb-4 text-[0.875em] leading-[1.5rem] flex-grow min-h-0 overflow-y-auto hidden-scrollbar"}>
                {children}
            </div>
        </div>
    )
}
