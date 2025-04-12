// 去重整合数据

exports.removeDuplicate = (arr, keyword) => {
  const map = new Map()
  arr.forEach(item => {
    if (map.has(item[keyword])) {
      map.get(item[keyword]).push(item)
    } else {
      map.set(item[keyword], [item])
    }
  })
  return Array.from(map, ([key, value]) => ({ key, value }));
}