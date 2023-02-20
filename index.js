const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const WSserver = require('express-ws')(app)
const ChatController = require('./ChatController')
const aWss = WSserver.getWss()
const authRouter = require('./authRouter.js')

const DB_URL = "mongodb+srv://user:user@cluster0.tpt6jpb.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery', true);
const PORT = 5000;

app.use(express.json())
app.use(cors())
app.use("/auth", authRouter)

async function startApp() {
    try {
        await mongoose.connect(DB_URL);
        app.ws('/ws', (ws, req) =>{
            ws.on('message', (msg)=>{
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








