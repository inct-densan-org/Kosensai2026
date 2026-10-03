// 2025年版のベース画像。屋台の配置は shops.ts の仮データ。
// https://github.com/inct-densan-org/Kosensai2025/tree/main/front/public/img/maps
import outdoor from '../../public/maps/map1.png'
import floor1 from '../../public/maps/map2.png'
import floor2 from '../../public/maps/map3.png'
import floor3 from '../../public/maps/map4.png'
import advanced from '../../public/maps/map5.png'

export const maps = [
  { id: 'outdoor', name: '屋外', image: outdoor },
  { id: 'floor1', name: '管理・教育棟1F', image: floor1 },
  { id: 'floor2', name: '管理・教育棟2F', image: floor2 },
  { id: 'floor3', name: '管理・教育棟3F', image: floor3 },
  { id: 'advanced', name: '専攻科・教育棟', image: advanced }
]
