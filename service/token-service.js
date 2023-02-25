const jwt = require('jsonwebtoken');
const TokenModel = require('../models/token-model.js')
const {ACCESS_SECRET, REFRESH_SECRET} = require ('../config.js')

class TokenService {
    generateTokens(payload) {
        console.log('HERE WE GO AGAIN')
        const accessToken = jwt.sign(payload, ACCESS_SECRET, {expiresIn: "30s"})
        const refreshToken = jwt.sign(payload, REFRESH_SECRET, {expiresIn: "30d"})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try{
            const userData = jwt.verify(token, ACCESS_SECRET)
            return userData
        }catch (e) {
            return null
        }
    }
    validateRefreshToken(token) {
        try{
            const userData = jwt.verify(token, REFRESH_SECRET)
            return userData
        }catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await TokenModel.findOne({user: userId})
        console.log(`Token-Service. TokenData: ${tokenData}`)
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await TokenModel.create({user: userId, refreshToken})
        return token;
    }
    async removeToken(refreshToken) {
        const tokenData = await TokenModel.deleteOne({refreshToken})
        return tokenData;
    }
    async findToken(refreshToken) {
        const tokenData = await TokenModel.findOne({refreshToken})
        return tokenData;
    }
}

module.exports = new TokenService();