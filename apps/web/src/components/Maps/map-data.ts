import { Label, Shop, Static } from "@/type";
import { StaticImageData } from "next/image";
import image1 from "@public/img/maps/map1.png";
import image2 from "@public/img/maps/map2.png";
import image3 from "@public/img/maps/map3.png";
import image4 from "@public/img/maps/map4.png";
import image5 from "@public/img/maps/map5.png";
type Data = {
  id: string;
  image: StaticImageData;
  shops: Shop[];
  labels: Label[];
  statics: Static[];
};

export const map1: Data = {
  id: "map1",
  image: image1,
  shops: [
    { idx: 0, x: 46.5, y: 88.5 },
    { idx: 1, x: 51, y: 85 },
    { idx: 2, x: 56, y: 83 },
    { idx: 3, x: 60, y: 83 },
    { idx: 4, x: 65, y: 83 },
    { idx: 5, x: 57.5, y: 79 },
    { idx: 6, x: 60.5, y: 77 },
    { idx: 7, x: 63, y: 75 },
    { idx: 8, x: 66, y: 73 },
    { idx: 9, x: 48, y: 71 },
    { idx: 10, x: 48, y: 67 },
    { idx: 11, x: 51.5, y: 60 },
    { idx: 12, x: 48, y: 52 },
    { idx: 13, x: 51.5, y: 54 },
    { idx: 14, x: 51.5, y: 49.5 },
    { idx: 15, x: 51.5, y: 45 },
    { idx: 16, x: 51.5, y: 40.5 },
    { idx: 17, x: 51.5, y: 36 },
    { idx: 18, x: 51.5, y: 31.5 },
    { idx: 19, x: 48, y: 39.5 },
    { idx: 20, x: 42.8, y: 78.2 },
    { idx: 52, x: 10, y: 27 },
    { idx: 53, x: 37, y: 12 },
    { idx: 55, x: 42, y: 12 },
    { idx: 56, x: 17, y: 27 },
    { idx: 54, x: 13.5, y: 27 },
  ],

  labels: [
    { name: "第一体育館", x: 39.2, y: 20 },
    { name: "第二体育館", x: 13.5, y: 22 },
    { name: "メディアセンター", x: 37, y: 65 },
    { name: "管理・教育棟", x: 75, y: 65 },
    { name: "専攻科・教育棟", x: 82, y: 83.5 },
    { name: "萩友会館", x: 37, y: 39 },
    { name: "総合情報センター", x: 68, y: 50 },
    { name: "一号棟", x: 80, y: 39 },
  ],

  statics: [
    { id: "受付", x: 34, y: 89, color: "blue" },
    { id: "受付", x: 30, y: 26, color: "blue" },
    { id: "休憩所", x: 58.5, y: 87, color: "blue" },
    { id: "ごみ箱", x: 48, y: 75, color: "green" },
    { id: "ごみ箱", x: 77, y: 78.5, color: "green" },
    { id: "ごみ箱", x: 54, y: 65, color: "green" },
    { id: "ごみ箱", x: 72, y: 70, color: "green" },
    { id: "ごみ箱", x: 39.2, y: 28, color: "green" },
    { id: "ごみ箱", x: 18, y: 31.5, color: "green" },
    { id: "バス", x: 65, y: 92, color: "blue", timeTable: true },
    { id: "保健室", x: 35, y: 50, color: "blue" },
    { id: "献血", x: 45, y: 28, color: "red" },
  ],
};

export const map2: Data = {
  id: "map2",
  image: image2,
  shops: [
    { idx: 21, x: 24.7, y: 31 },
    { idx: 22, x: 13, y: 53.5 },
    { idx: 23, x: 40, y: 57 },
    { idx: 24, x: 46.8, y: 53 },
    { idx: 25, x: 53.8, y: 53 },
    { idx: 26, x: 76.5, y: 78 },
  ],
  labels: [{ name: "管理・教育棟 1F", x: 10, y: 20 }],
  statics: [{ id: "ごみ箱", x: 43.5, y: 50, color: "green" }],
};

export const map3: Data = {
  id: "map3",
  image: image3,
  shops: [
    { idx: 30, x: 45, y: 53 },
    { idx: 31, x: 53, y: 53 },
    { idx: 32, x: 82, y: 53 },
    { idx: 29, x: 37.7, y: 53 },
    { idx: 28, x: 34, y: 53 },
    { idx: 27, x: 38.5, y: 20 },
    { idx: 33, x: 86, y: 53 },
    { idx: 34, x: 60, y: 77 },
  ],
  labels: [{ name: "管理・教育棟 2F", x: 10, y: 20 }],
  statics: [{ id: "ごみ箱", x: 42.5, y: 49, color: "green" }],
};

export const map4: Data = {
  id: "map4",
  image: image4,
  shops: [
    { idx: 35, x: 32, y: 55 },
    { idx: 36, x: 39, y: 55 },
    { idx: 37, x: 46, y: 55 },
    { idx: 38, x: 52, y: 55 },
    { idx: 39, x: 69, y: 55 },
  ],
  labels: [{ name: "管理・教育棟 3F", x: 10, y: 20 }],
  statics: [],
};

export const map5: Data = {
  id: "map5",
  image: image5,
  shops: [
    { idx: 40, x: 13, y: 37 },
    { idx: 41, x: 39, y: 37 },

    { idx: 42, x: 61, y: 17 },
    { idx: 42, x: 61, y: 37 },
    { idx: 43, x: 87.5, y: 37 },

    { idx: 44, x: 13.1, y: 57 },
    { idx: 45, x: 38.8, y: 57 },
    { idx: 46, x: 13.1, y: 77 },
    { idx: 47, x: 38.8, y: 77 },

    { idx: 48, x: 61, y: 57 },
    { idx: 49, x: 87.5, y: 57 },
    { idx: 50, x: 61, y: 77 },
    { idx: 51, x: 87.5, y: 77 },
  ],
  labels: [{ name: "専攻科・教育棟", x: 10, y: 15 }],
  statics: [{ id: "ごみ箱", x: 74, y: 62, color: "green" }],
};
