const mongoose = require ('mongoose')
const Schema  = mongoose.Schema

const postSchema = new Schema ({
    AuthorId: {
        type: Schema.Types.ObjectId,
        ref: 'user_model',
        required: true,
    },
    Author: String,
    Description: {
        type: String,
        required: true,
    },
    
    createdAt:{type: Date, default: Date.now},
    updatedAt:{type: Date, default: Date.now}
    

}) 

module.exports = mongoose.model('posts', postSchema)