import React from "react";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Window } from "@/components/ui/window"; // Import the updated Window component

export function Modal({
  children,
  button,
  title,
  subtitle,
  defaultOpen = false,
  className = "",
  ModalClass = "",
  titleAction
}: {
  children: React.ReactNode;
  button: React.ReactNode;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  className?: string;
  ModalClass?:string;
  titleAction?: React.ReactNode;
}) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger
        render={(props) => (
          <button
            {...props}
            className={cn(
              "relative w-full h-full border-0 bg-transparent p-0 text-inherit shadow-none hover:bg-transparent",
              props.className,
            )}
          >
            {button}
          </button>
        )}
      >
        {button}
      </DialogTrigger>
      <DialogContent className={cn("bg-transparent border-none shadow-none p-0 w-auto max-w-none",ModalClass)}>
      
      <DialogTitle className="w-0! h-0! hidden">
      </DialogTitle>
        <Window title={title} subtitle={subtitle} className={cn("max-h-[80vh] w-[90vw] md:w-[60vw]", className)} titleAction={titleAction}>
          {children}
        </Window>
      </DialogContent>
    </Dialog>
  );
}
