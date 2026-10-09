import { StaticImageData } from "next/image"
import { LucideIcon } from "lucide-react"

export type ShopData = {
  mapId:number
  title: string
  desc:string
  images: (string|StaticImageData)[]
}

export type Shop = {
  idx:number,
  x:number,
  y:number,
  color?:"red"|"blue"|"green"
}
export type Label = {
  name:string
  x:number
  y:number
}
export type Static = {
  id:string
  x:number,
  y:number,
  color?:"red"|"blue"|"green"
  timeTable?:boolean
}
