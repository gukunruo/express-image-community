// const fs = require('fs');
// const path = require('path');
// // const path = ''; // 替换为你的文件夹路径
// fs.mkdirSync(path.join(__dirname, `./a/b`), { recursive: true }); // 创建文件夹

// const path = require('path');
// const a = 'a\b\c'

// console.log(path.join(a));

const fs = require('fs');
fs.readFile("uploads\\username\\模糊图片.jpg",  (err, result) => {
  console.log(result);
})