const jwt = require('jsonwebtoken')
const {REFRESH_SECRET, ACCESS_SECRET} = require('../config.js')

module.exports = function (roles){
   return function(req,res,next) {
       if (req.method === "OPTIONS") {
           next()
       }
       try {
           if(!req.headers.authorization){
               return res.status(403).json({message: "Пользователь не авторизован"})
           }
           const token = req.headers.authorization.split(' ')[1];
           const {roles: userRoles} = jwt.verify(token, ACCESS_SECRET);
           let hasRole = false;
           userRoles.forEach(role=> {
               if(roles.includes(role)){
                   hasRole = true;
               }
           })
           if (!hasRole){
               return res.status(403).json({message: "У вас нет доступа"})
           }

           next()
       } catch (e) {
           console.log(e);
           return res.status(403).json({message: "Пользователь HE авторизован"})
       }
   }
}