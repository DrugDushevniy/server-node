const jwt = require('jsonwebtoken')
const {secret} = require('../config.js')

module.exports = function (req,res,next){
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        if(!req.headers.authorization){
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
        const token = req.headers.authorization.split(' ')[1];
        const decodedData = jwt.verify(token, secret);
        req.user = decodedData
        next()
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: "Пользователь не авторизован"})
    }
}