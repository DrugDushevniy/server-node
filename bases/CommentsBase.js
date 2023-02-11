const mongoose = require('mongoose')

const CommentsBase = new mongoose.Schema({
    author: {type: String, required: true},
    body: {type: String, required: true},
    ids: {type: Number, required: true},
    date: {type: String, required: true},
})


module.exports = mongoose.model('CommentsBaseSchema', CommentsBase)