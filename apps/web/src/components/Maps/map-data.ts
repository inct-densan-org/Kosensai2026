import { Label, Shop, Static } from "@/type"
import { StaticImageData } from "next/image"
import image1 from "@public/img/maps/map1.png"
import image2 from "@public/img/maps/map2.png"
import image3 from "@public/img/maps/map3.png"
import image4 from "@public/img/maps/map4.png"
import image5 from "@public/img/maps/map5.png"
type Data = {
  id:string
  image:StaticImageData
  shops:Shop[]
  labels:Label[]
  statics:Static[]
}

export const map1:Data = {
  id:"map1",
  image:image1,
  shops:[
    { idx:0, x:42, y:92 },
    { idx:1, x:44.75, y:89.5 },
    { idx:2, x:47.6, y:87 },
    { idx:3, x:50.5, y:84.5 },
    { idx:4, x:55, y:83 },
    { idx:5, x:60, y:83 },
    { idx:6, x:65, y:83 },
    { idx:7, x:57.5, y:79 },
    { idx:8, x:60.2, y:77 },
    { idx:9, x:62.8, y:75 },
    { idx:10, x:66, y:73 },
    { idx:11, x:69, y:73 },
    { idx:12, x:48, y:65 },
    { idx:13, x:48, y:60 },
    { idx:14, x:48, y:55 },
    { idx:15, x:53, y:57 },
    { idx:16, x:51.5, y:53 },
    { idx:17, x:51.5, y:48 },
    { idx:18, x:51.5, y:43 },
    { idx:19, x:51.5, y:38 },
    { idx:20, x:51.5, y:33 },
    { idx:21, x:42.8, y:78.2 },
    { idx:22, x:38.5, y:49 },
    { idx:45, x:37, y:26 },
    { idx:46, x:42, y:26 },
    { idx:47, x:10, y:28 },
    { idx:48, x:13.5, y:28 },
    { idx:46, x:71.3, y:78 },
    { idx:49, x:71.3, y:83 },
    { idx:50, x:71.3, y:88 },
    { idx:51, x:34.5, y:49 },
  ],
  labels:[
    { name:"第一体育館", x:39.2, y:20 },
    { name:"第二体育館", x:13.5, y:22 },
    { name:"メディアセンター", x:37, y:65 },
    { name:"管理・教育棟", x:75, y:65 },
    { name:"専攻科・教育棟", x:82, y:83.5 },
  ],
  statics:[
    { id: "受付", x:30, y:92, color:"green" },
    { id: "受付", x:30, y:26, color:"green" },
    { id: "休憩所", x:58.5, y:89, color:"green" },
    { id: "ごみ箱", x:49, y:78.2, color:"green" },
    { id: "ごみ箱", x:77, y:78.5, color:"green" },
    { id: "ごみ箱", x:54, y:65, color:"green" },
    { id: "ごみ箱", x:72, y:70, color:"green" },
    { id: "ごみ箱", x:47, y:28, color:"green" },
    { id: "ごみ箱", x:18, y:31.5, color:"green" },
    { id: "バス", x:65, y:92, color:"red", timeTable:true },
    { id: "企業", x:48, y:70, color:"blue" },
    { id: "企業", x:48, y:50, color:"blue" },
    { id: "企業", x:48, y:45, color:"blue" },
    { id: "企業", x:48, y:40, color:"blue" },
    { id: "企業", x:48, y:35, color:"blue" },
  ]
}


export const map2:Data = {
  id:"map2",
  image:image2,
  shops:[
    { idx:23, x:46.8, y:53 },
    { idx:24, x:53.8, y:53 },
    { idx:53, x:12.7, y:52.5 },
    { idx:26, x:24.7, y:31 },
    { idx:34, x:40, y:57 },
    { idx:37, x:83.8, y:43 },
    { idx:30, x:25, y:53 },
  ],
  labels:[
    { name:"管理・教育棟 1F", x:10, y:20 },
  ],
  statics:[]
}

export const map3:Data = {
  id:"map3",
  image:image3,
  shops:[
    { idx:25, x:83.5, y:54 },
    { idx:27, x:37.6, y:54 },
    { idx:28, x:45, y:54 },
    { idx:29, x:53, y:54 },
    { idx:52, x:60.9, y:78 },
    { idx:36, x:39.1, y:21 },
  ],
  labels:[
    { name:"管理・教育棟 2F", x:10, y:20 },
  ],
  statics:[]
}

export const map4:Data = {
  id:"map4",
  image:image4,
  shops:[
    { idx:30, x:31, y:55 },
    { idx:31, x:38, y:55 },
    { idx:32, x:45, y:55 },
    { idx:33, x:51.5, y:55 },
    { idx:35, x:67.3, y:55 },
  ],
  labels:[
    { name:"管理・教育棟 3F", x:10, y:20 }
  ],
  statics:[]
}

export const map5:Data = {
  id:"map5",
  image:image5,
  shops:[
    { idx:38, x:11, y:37 },
    { idx:39, x:14.5, y:37 },
    { idx:40, x:38.8, y:37 },

    { idx:41, x:61, y:37 },
    { idx:41, x:61, y:17 },
    { idx:54, x:87.5, y:37 },

    { idx:42, x:13.1, y:77 },
    { idx:43, x:13.1, y:57 },
    { idx:44, x:38.8, y:57 },
    { idx:44, x:38.8, y:77 },
    
    { idx:30, x:87, y:77 },
  ],
  labels:[
    { name:"専攻科・教育棟", x:10, y:15 }
  ],
  statics:[
    { id: "企業", x:87, y:57, color:"blue" },
  ]
}
