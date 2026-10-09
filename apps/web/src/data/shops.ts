export const shops = [
  {
    id: 'popcorn',
    name: '出来立てのポップコーンはいかが？',
    image: '/shops/placeholder.svg',
    location: '屋外',
    description: '色んなフレーバー用意しているのであなたの好みにきっと合います!!\n食べ歩きにもってこいなのでぜひよってみてください!!',
    pins: [{ mapId: 'outdoor', x: 66, y: 73 }]
  },
  {
    id: 'crepe',
    name: 'クレープ屋さん',
    image: '/shops/placeholder.svg',
    location: '屋外',
    description: '焼きたてのクレープをご用意しています。\nチョコやいちごなど、お好みの味を選んでください。',
    pins: [{ mapId: 'outdoor', x: 43, y: 89 }]
  },
  {
    id: 'games',
    name: 'ゲーム体験コーナー',
    image: '/shops/placeholder.svg',
    location: '管理・教育棟1F',
    description: '学生が制作したゲームを体験できます。\n初めての方も気軽に遊びに来てください。',
    pins: [{ mapId: 'floor1', x: 46, y: 57 }]
  },
  {
    id: 'science',
    name: 'わくわく科学実験',
    image: '/shops/placeholder.svg',
    location: '管理・教育棟1F',
    description: '身近な科学の不思議を紹介します。\n実験の様子を間近でご覧いただけます。',
    pins: [{ mapId: 'floor1', x: 83, y: 42 }]
  },
  {
    id: 'photo',
    name: '写真部展示',
    image: '/shops/placeholder.svg',
    location: '管理・教育棟2F, 3F',
    description: '日常や風景を切り取った作品を展示しています。\nお気に入りの一枚を探してみてください。',
    pins: [
      { mapId: 'floor2', x: 45, y: 55 },
      { mapId: 'floor3', x: 20, y: 30 }
    ]
  },
  {
    id: 'cafe',
    name: 'ひとやすみ喫茶',
    image: '/shops/placeholder.svg',
    location: '管理・教育棟2F',
    description: '飲み物とお菓子を用意しています。\n校内を巡る合間にひとやすみしませんか。',
    pins: [{ mapId: 'floor2', x: 83, y: 55 }]
  },
  {
    id: 'art',
    name: '美術部作品展',
    image: '/shops/placeholder.svg',
    location: '管理・教育棟3F',
    description: '絵画やイラストなどの作品を展示しています。\n部員それぞれの表現をお楽しみください。',
    pins: [{ mapId: 'floor3', x: 38, y: 55 }]
  },
  {
    id: 'puzzle',
    name: '謎解き教室',
    image: '/shops/placeholder.svg',
    location: '管理・教育棟3F',
    description: '仲間と相談しながら謎解きに挑戦！\n会場で問題を受け取ってください。',
    pins: [{ mapId: 'floor3', x: 67, y: 55 }]
  },
  {
    id: 'board-games',
    name: 'ボードゲーム広場',
    image: '/shops/placeholder.svg',
    location: '専攻科・教育棟',
    description: 'みんなで楽しめるボードゲームを集めました。\nルールはスタッフがご説明します。',
    pins: [{ mapId: 'advanced', x: 14, y: 37 }]
  },
  {
    id: 'research',
    name: '研究紹介コーナー',
    image: '/shops/placeholder.svg',
    location: '専攻科・教育棟',
    description: '学生の研究や制作物をご紹介します。\n気になることは気軽に質問してください。',
    pins: [{ mapId: 'advanced', x: 61, y: 37 }]
  }
]

export type Shop = (typeof shops)[number]
