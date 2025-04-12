const express = require('express')
const fs = require('fs');
const path = require('path');
const dashboard = express.Router()
const multer = require('multer')
const server = require('../server')

// 声明fileFilter函数
const fileFilter = (req, file, callback) => {
    // 解决中文名乱码的问题 latin1 是一种编码格式
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
    );
    callback(null, true);
};
// 配置multer，指定上传文件的存储路径
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log(req.query.uid); // 用户名创建文件夹
        try {
            fs.mkdirSync(path.join(__dirname, `../uploads/${req.userinfo.username}`)); // 创建文件夹
        } catch (error) {
        }
        cb(null, `uploads/${req.userinfo.username}`); // 指定文件存储的目标目录
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // 指定文件名
    }
});
const upload = multer({ storage: storage, fileFilter: fileFilter });

dashboard.post('/upload', upload.single('file'), (req, res) => {
    const dir = req.file.destination;
    const name = req.file.originalname;
    const url = dir + '/' + name;
    const username = req.userinfo.username;

    const result = `SELECT * FROM image WHERE url = '${url}'`
    server.db.query(result, [url], (err, results) => {
        console.log(results);
        if (results.length === 0) {
            const sqlStr = "insert into image(url,username,open) values(?,?,?)"
            server.db.query(sqlStr, [url, username, true], (err, results) => {
                if (err) throw err
                if (results.affectedRows === 1) {
                    res.send({ code: 1, msg: "保存成功" })
                } else {
                    res.send({ code: 0, msg: "保存失败" })
                }
            })
        } else {
            res.send({ code: 0, msg: "该图片已存在" })
        }
    })
    // const {formData} = req.body;
    // console.log(formData.get('file'));
    // const filePath = `uploads/${fileName}`; // 指定保存路径和文件名
    // fs.rename(req.file.path, filePath, (err) => {
    //     if (err) {
    //         console.error('保存文件时出错：', err);
    //         res.status(500).send('保存文件失败');
    //     } else {
    //         console.log('文件已成功保存到本地');
    //         res.status(200).send('文件保存成功');
    //     }
    // });

    // res.send(req.file.originalname)
    // 拿到用户 id 和 资源

    // 存到image表
    //   找个图床，进行资源的链接生成，然后在表里存链接和用户id

    // 根据参数的配置项，进行utils图片操作函数的处理，然后存起来
})
module.exports = dashboard;