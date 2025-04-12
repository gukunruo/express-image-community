var jwt = require("jsonwebtoken")

exports.tokenCheck = (req, res, next) => {
  console.log('middleware -- 中间件校验');
  // 判断token
  if (req.headers.authorization !== undefined || req.headers.authorization !== null) {
    const token = req.headers.authorization.split(" ")[1] // 获取token
    jwt.verify(token, "secret", (err, decode) => {
      if (err) {
        console.log('err', err);
        res.status = 401
        res.send({ code: 401, msg: "Unauthorized: Invalid token" })
      } else {
        // 解析成功 
        console.log(decode, 'decode middleware');
        // 【下发】验证得到的信息
        req.userinfo = decode
        next()
      }
    })
  } else {
    res.status = 401
    res.send({ code: 401, msg: "Unauthorized: Invalid token" })
  }
}