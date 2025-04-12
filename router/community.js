const express = require('express');
const community = express.Router()

const fs = require('fs');
const server = require('../server')
const utils = require('../utils')


community.get('/', (req, res) => {
    res.send('community');
});
community.post('/list', (req, res) => {

    // 查找所有数据
    const sqlStr = `SELECT * FROM user`
    console.log('list');
    server.db.query(sqlStr, async (err, results) => {
        // 所有用户名
        if (err) throw err
        if (results.length >= 1) {
            // 用户名列表
            const usernames = results.map(item => item.userName)

            // 构建SQL查询
            const placeholders = usernames.map((item) => `'${item}'`).join();

            const sqlStr = `SELECT * FROM image WHERE username IN (${placeholders})`;
            server.db.query(sqlStr, usernames, async (err, results2) => {
                if (err) throw err
                if (results2.length >= 1) {
                    const imgArr = results2.filter(item => (item.open === '1'))
                    const pathArr = imgArr.map(item => {
                        return item.url
                    })
                    const result3 = await utils.getImage(pathArr)
                    const result4 = imgArr.map((item, index) => {
                        return {
                            img: result3[index],
                            ...item
                        }
                    })
                    const keyValueArray = utils.removeDuplicate(result4, 'username')
                    res.send({ code: 1, data: keyValueArray })
                } else {
                    res.send({ code: 0, msg: "没有数据" })
                }
            })

        } else {
            res.send({ code: 0, msg: "没有用户" })
        }
    })

    return
});
module.exports = community;