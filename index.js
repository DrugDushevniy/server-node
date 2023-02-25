const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const WSserver = require('express-ws')(app)
const ChatController = require('./ChatController')
const aWss = WSserver.getWss()
const authRouter = require('./authRouter.js')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewarez/errorMiddleware')

const DB_URL = "mongodb+srv://user:user@cluster0.tpt6jpb.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery', true);
const PORT = 5000;

app.use(cors({
    credentials: true,
    origin: "http://1253919-ca24285.tw1.ru/"
}))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://1253919-ca24285.tw1.ru/')
    next()})
app.use(express.json())
app.use(cookieParser())
app.use("/auth", authRouter)
app.use(errorMiddleware)


async function startApp() {
    try {
        await mongoose.connect(DB_URL);
        app.ws('/ws', (ws, req) =>{
            ws.on('message', (msg)=>{
                try {
                    let readyMessage = JSON.parse(msg)
                    switch (readyMessage.method) {
                        case "connection":
                            ws.id = readyMessage.id;
                            ChatController.getAllMessages().then(res=>ws.send(JSON.stringify({
                                method: "first-connection",
                                allMessages: res
                            })));
                            broadcastConnection(ws, readyMessage)
                            console.log(`Подключился пользователь. ID: ${ws.id}`)
                            break
                        case "message":
                            ChatController.postMessage(readyMessage.body).then(res=>broadcastNewMessage(ws,res))
                            break
                        default:
                            console.log('Нет такого')
                            break
                    }
                }
                catch (e) {
                    ws.close(1003)
                }


            })

        const broadcastConnection = (ws,msg) => {
                aWss.clients.forEach(client=> {

                    if (client.id !== msg.id) {

                        client.send(JSON.stringify({
                            body: `Пользователь с ID ${msg.id} подключился`,
                            method: "new-connection-msg"
                        }))
                    }
                })

        }
            const broadcastNewMessage = (ws, msg) => {
                aWss.clients.forEach(client=> {
                        client.send(JSON.stringify({
                            body: msg,
                            method: "new-message"
                        }))
                })
            }

        });


        app.listen(PORT, ()=> console.log(`Сервер запустился на ${PORT} порту`))
    }
    catch (err) {
        console.log("Ошибка со Start APP ", err)
    }
}
startApp()








