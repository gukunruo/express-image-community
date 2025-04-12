const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const mysql = require('mysql');
const fs = require('fs');
// 路由
const login = require('./router/login');
const home = require('./router/home');
const user = require('./router/user');
const dashboard = require('./router/dashboard');
const community = require('./router/community');
const { tokenCheck } = require('./middleware/tokenCheck');


const app = express();
// 注册静态资源中间件
app.use('/public', express.static('public')) // 在这里使用理这个中间件之后，在html里就可以写src为./public/img/people.png
function logger(req, res, next) {
    const time = new Date();
    console.log(`[${time.toLocaleString()}] ${req.method}  ${req.url}`);
    next()
}
// 格式解析中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// 全局中间件
app.use(cors()); // 跨域
app.use(logger); // 日志
app.use('/login', login);

app.use(tokenCheck) // token校验中间件
app.use(cookieParser('123456'))
// 路由
app.use('/home', home);
app.use('/user', user);
app.use('/dashboard', dashboard);
app.use('/community', community);
// 数据库连接
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test',
})
exports.db = db;
// 接口
app.get('/getPeople', (req, res) => {
    db.query('SELECT * FROM user',
        (err, results) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log(results);
                // res.cookie("user", '62566', { maxAge: 60000000, httpOnly: false, signed: true });
                res.send(JSON.stringify(results));
            }
        }
    );
});

app.post('/addPeople', (req, res) => {
    db.query('INSERT INTO user(username, animal) VALUES("xiaoming", "doggs")',
        (err, results) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log(results);
                res.send(JSON.stringify(results));
            }
        }
    );
});
app.post('/addImage', (req, res) => {
    fs.readFile('bg.jpg',
        (err, data) => {
            let sql = 'INSERT INTO img SET ?';
            let post = { img: data, name: 'bg' };

            db.query(sql, post, (error, results) => {
                if (error) throw error;
                console.log("Image file has been saved to DB.");
            });
        }
    );
});
app.get('/getImage', (req, res) => {

    // const query = `
    //     SELECT img.* 
    //     FROM img 
    //     JOIN user ON user.id = img.id 
    //     WHERE user.username = ?
    // `
    // console.log('res', req.query);// get请求是query里拿查询参数，而不是param携带参数
    // db.query(query,[req.query.username], (error, results) => {
    //     let image = results[0].img;
    //     res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    //     // 将二进制数据写入响应
    //     res.end(image, 'binary');
    // });
    db.query('SELECT * FROM image', (error, results) => {
        let image = results[2].img;
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        // 将二进制数据写入响应
        res.end(image, 'binary');
    });
});
app.get('/deleteData', (req, res) => {
    const deleteSql = "DELETE FROM user WHERE username = ?";

    db.query(deleteSql, ['xiaoming'], (error, results) => {
        res.send('ok')
    });
});



// 中间件 错误处理
app.use((err, req, res, next) => {
    console.log('req', req.url);
    res.status(500).send(err.message);
})

// 中间件兜底  当上面都未命中时会走这个
app.use((req, res, next) => {
    // 为客户端响应404状态码以及提示信息
    res.status(404).send('当前访问的页面是不存在的');
})


// 开启端口
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});