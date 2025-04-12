const express = require('express');

const jwt = require("jsonwebtoken") // token生成
const md5 = require('../utils/md5') // 密码加密
const server = require('../server') // 数据库

const login = express.Router() // 创建路由

login.get('/', (req, res) => {
	res.send('home');
});
login.get('/list', (req, res) => {
	res.send('list');
});

//注册接口 post请求
login.post("/register", (req, res) => {
	const userName = req.body.username // 获取请求体 用户名
	const passWord = req.body.password // 获取请求体 密码
	// console.log( req.body,userName, passWord);
	if (!userName || !passWord) { // 判断用户名和密码是否为空
		res.send({
			code: 0,
			msg: "用户名与密码为必传参数...",
		})
		return // 结束函数
	}

	if (userName && passWord) {
		const result = `SELECT * FROM user WHERE username = '${userName}'`
		server.db.query(result, [username], async (err, results) => {
			if (err) throw err
			if (results.length >= 1) {
				//2、如果有相同用户名，则注册失败，用户名重复
				res.send({ code: 0, msg: "注册失败，用户名重复" })
			} else {
				const bcrypt_secret_password = await md5.hashPassword(passWord) // 密码加密
				const sqlStr = "insert into user(username, password_hash) values(?,?)"
				server.db.query(sqlStr, [userName, bcrypt_secret_password], (err, results) => {
					if (err) throw err
					if (results.affectedRows === 1) {
						res.send({ code: 1, msg: "注册成功" })
					} else {
						res.send({ code: 0, msg: "注册失败" })
					}
				})
			}
		})
	}
	console.log("接收", req.body)
})

// 登录接口 post请求
login.post("/login", (req, res) => {
	const userName = req.body?.username
	const passWord = req.body?.password
	// if (!userName || !passWord) {
	// 	res.send({
	// 		code: 0,
	// 		msg: "用户名与密码为必传参数...",
	// 	})
	// 	return
	// }
	// const sqlStr = "select * from user WHERE userName=? AND passWord=?"
	const sqlStr = "select * from user WHERE username=?"
	server.db.query(sqlStr, [userName], async (err, result) => {
		if (err) throw err
		console.log(result, result[0].identity);
		if (result.length > 0) {

			// 判断用户名密码是否正确
			const isMatch = await md5.bcrypt.compare(passWord, result[0].password_hash)
			console.log('isMatch', isMatch);
			if (isMatch) {
				// 生成token
				var token = jwt.sign(
					{
						user_id: result[0].user_id,
						username: result[0].username,
					},
					"secret",
					{ expiresIn: "1h" },
				)
				res.send({ code: 1, msg: "登录成功", token: token, uid: result[0].user_id })
			} else {
				res.send({ code: 0, msg: "密码错误" })
			}
			// 如果没有登录成功，则返回登录失败
		} else {
			console.log('没有账号密码，走token校验');
			// 判断token
			if (req.headers.authorization !== undefined || req.headers.authorization !== null) {
				if (req.headers.authorization) {
					var token = req.headers.authorization.split(" ")[1] // 获取token
				}
				jwt.verify(token, "secret", (err, decode) => {
					if (err) {
						res.send({ code: 0, msg: "登录失败" })
					}
					console.log(decode, 'decode');
				})
			}
		}
	})
})
module.exports = login;