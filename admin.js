const express = require('express');
const app = express()
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const SendGioiThieu = require('./models/SendGioiThieu');
const GioiThieu = require('./models/CodeGioiThieu');

app.set('trust proxy', 1)


const session = cookieSession({
    name: 'session',
    keys: ["dfghfgjh,4,,,.y","6y7i4ghfgfgfg"],
    maxAge: 2400 * 60 * 60 * 10,
    cookie: {
        httpOnly: true,
        secure: true
    }
})

app.use(session)

dotenv.config()
mongoose.connect(process.env.DB_CONNECT, {}, () => console.log('Connected to db'));
app.use(express.static('public'))
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', require('./routers/momo'))

app.get("/sendgt",async(req,res)=>{
    const check = await SendGioiThieu.find({})
    res.send(check)
})

app.get("/gt",async(req,res)=>{
    const checkgt = await GioiThieu.find({time:-1})
    res.send(checkgt)
})
const server = require('http').createServer(app);
server.listen(5556, () => console.log('Server admin Running on port 5556'));