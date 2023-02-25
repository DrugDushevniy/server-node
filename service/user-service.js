const User = require('../models/User.js');
const Role = require('../models/Role.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {ACCESS_SECRET, REFRESH_SECRET} = require ('../config.js')
const TokenModel = require('../models/token-model.js')
const TokenService = require('../service/token-service.js')
const UserDTO = require('../DTOs/user-dto.js')
const ApiError = require('../exceptions/api-error.js')


class UserService {
    async registration(username, password) {


            const candidate = await User.findOne({username})
            if (candidate) {
                throw ApiError.BadRequest(`Пользователь ${candidate.username} уже существует.`)

            }
            const hashPassword = bcrypt.hashSync(password,7)
            const userRole = await Role.findOne({value: "USER"})
            const user = await User.create({username, password: hashPassword, roles: [userRole.value]})
            const userDto = new UserDTO(user) // _id, username, roles
            const tokens = TokenService.generateTokens({...userDto})
            await TokenService.saveToken(userDto.id, tokens.refreshToken)

            return {
                ...tokens,
                user: userDto
            }
    }
    async login(username, password) {
            const user = await User.findOne({username})
            if(!user) {
                throw ApiError.BadRequest(`Пользователь ${username} не существует.`)
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword){
                throw ApiError.BadRequest(`Введен неверный пароль`)
            }
            const userDto = new UserDTO(user); // _id, username, roles
            const tokens = TokenService.generateTokens({...userDto});
            await TokenService.saveToken(userDto.id, tokens.refreshToken);
            return {
                ...tokens,
                user: userDto
            }
    }
    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken)
        return token;
    }
    async refresh(refreshToken){
        if(!refreshToken) {
            throw ApiError.Unauthorized('Токена нет')
        }
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await TokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.Unauthorized()
        }
        const user = await User.findById(userData.id)
        const userDto = new UserDTO(user); // _id, username, roles
        const tokens = TokenService.generateTokens({...userDto});
        await TokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        }
    }
    async getAllUsers() {
        const users = await User.find();
        return users
    }

 }

module.exports = new UserService()

