const express = require('express');
const home = express.Router()
const fs = require('fs');
const server = require('../server')
const utils = require('../utils')


home.get('/', (req, res) => {
    res.send('home');
});
home.post('/list', (req, res) => {
    const username = req.body.username
    const sqlStr = `SELECT * FROM image WHERE username = '${username}'`
    server.db.query(sqlStr, [username], async (err, results) => {
        if (err) throw err
        if (results.length >= 1) {
            const result = await utils.getImage(results.map(item => item.url))
            const data = results.map((item, index) => {
                return {
                    img: result[index],
                    ...item
                }
            })
            res.send({ code: 1, data: data })
        } else {
            res.send({ code: 0, msg: "没有数据" })
        }
    })

    return

});
module.exports = home;