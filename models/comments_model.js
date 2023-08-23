const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const commentsSchema = new Schema ({
    PostId: {
        type: Schema.Types.ObjectId,
        ref: 'post_model',
        required: true,
    },
    Comment: String,
    createdAt:{type: Date, default: Date.now}
})

module.exports = mongoose.model('comments', commentsSchema);