const fs = require('fs');

exports.getImage = async (paths) => {
  // 拿到路径
  // const paths = [
  //     "uploads\\username\\模糊图片.jpg",
  //     "uploads\\username\\晚风图片.jpg"
  // ]
  // 同步读取文件
  const readFileAsync = async (filePath) => {
      const fileData = await fs.readFileSync(filePath);
      return fileData;
  };
  // 并发请求数组
  const arrPromise = paths.map((path) => readFileAsync(path))
  const files = await Promise.all(arrPromise);
  const result = files.map((file) => 'data:image/png;base64,' + Buffer.from(file, 'utf-8').toString('base64'))
  return result
  // 拿到结果后buffer转base64返回
  // asyncFiles.then((files) => {
  //     const result = files.map((file) => 'data:image/png;base64,' + Buffer.from(file, 'utf-8').toString('base64'))
  //     res.send(result)
  //     return result
  // })
}