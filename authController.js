const userService = require('./service/user-service.js')
const {validationResult} = require('express-validator')
const ApiError = require('./exceptions/api-error.js')

class authController {
    async registration(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Введены неверные данные', errors.array()))
            }
            const {username, password} = req.body;

            const userData = await userService.registration(username,password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true, sameSite: 'Strict'})
            return res.status(200).json(userData)
        }
        catch(e){
            next(e)
        }
    }
    async login(req,res,next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Введены неверные данные', errors.array()))
            }
            const {username, password} = req.body;
            const userData = await userService.login(username,password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true, sameSite: 'Strict'})
            console.log('res.cookie: ', req.cookies)
            return res.json(userData)
        }catch (e) {
            next(e)
        }
    }
    async logout (req,res,next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token)
        }catch (e) {
            next(e)
        }
    }
    async refresh (req,res,next) {
        try{
            const {refreshToken} = req.cookies;
            console.log(`КУККИ Auth Controller (())`,req.cookies)
            console.log(`refreshToken Auth Controller (())`, refreshToken)
            const userData = await userService.refresh(refreshToken)
            console.log(`USERDATA(НОВЫЕ ТОКЕНЫ) Auth Controller (())`, userData)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true, sameSite: 'Strict'})
            return res.json(userData)
        }
        catch (e) {
            next(e)
        }
    }
    async getUsers(req, res,next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users)
        }catch (e) {
            next(e)
        }
    }

}
module.exports = new authController()