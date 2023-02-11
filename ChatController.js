const ChatMessagesBase = require('./bases/ChatMessagesBase.js');
const events = require("events")

async function addNewMessageToBase (message){
    const {author, body, ids, date} = message;
    return await ChatMessagesBase.create({author, body, ids, date})

}

const emitter = new events.EventEmitter;

class ChatController {
    async getAllMessages (req,res)  {
        try {
            return await ChatMessagesBase.find()
        }
        catch (e) {
            throw e
        }
    }

    postMessage(message){
        try{
            return addNewMessageToBase(message)
        }
        catch (err) {
            throw err
        }
    }
}

module.exports = new ChatController();
