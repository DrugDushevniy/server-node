const Router = require('express');
const controller = require('./authController.js');
const {check} = require('express-validator');
const roleMiddleware = require('./middlewarez/roleMiddleware.js')


const router = new Router();
const validationArr = [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен быть длиннее 4 и меньше 10 символов").isLength({min:4, max:10})

]

router.post('/registration', validationArr, controller.registration);
router.post('/login', validationArr, controller.login)
router.post('/logout', controller.logout)
router.get('/refresh', controller.refresh)
router.get('/users',roleMiddleware(["USER","ADMIN"]), controller.getUsers)

module.exports = router