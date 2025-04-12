// const crypto = require('crypto');
// // 创建md5的hash值，加入加密值123，摘要digest以hex16进制字符串展示
// var d = crypto.createHash('md5').update('123').digest('hex')
// console.log(d);

// bcryptjs 比crypto速度快，且更安全，每次都是随机 salt盐 但是还是可以有api compare 比较密码是否相等，且不用知道随机盐值是什么
const bcrypt = require('bcryptjs');

// 加密密码函数
async function hashPassword(password) {
  const saltRounds = 10; // 可以调整这个值以增加计算复杂度
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

exports.bcrypt = bcrypt;
exports.hashPassword = hashPassword;

// hashPassword('123').then(res => {
//   console.log(res);
//   setTimeout(async () => {
//     console.log(await bcrypt.compare('123', res));
//     hashPassword('123').then(async (res) => {
//       console.log('after',await bcrypt.compare('123', res));
//     })
//   }, 2);
// })

