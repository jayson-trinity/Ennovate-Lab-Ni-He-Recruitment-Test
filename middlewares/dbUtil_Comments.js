const comments_model = require ('../models/comments_model')
const posts_model = require ('../models/post_model')

const Comments = comments_model;
const Posts = posts_model;

exports.postComment = async (data, post_id) => {
    try {
        const post =  Posts.findOne({_id: post_id})
        if (!post) {
            throw new Error ('post not found')
        }
        const newComment = {
            Comment: data.Comment,
            PostId: post_id,
         }
        return await new Comments(newComment).save();
    } catch (error) {
        throw error
    }
}

exports.editComment = async (data, comment_id) => {
    const comment = await Comments.findByIdAndUpdate(
        {_id: comment_id},
        {$set: data},
        {new: true}
    )
    if (!comment) {
        throw ('comment not found')
    }
    return comment;
}

exports.getComments = async (post_id) => {
    const comments = Comments.find({PostId: post_id}).select('-_id Comment');
    if (!comments) {
        throw ('No commments found')
    }
    return comments;
}

exports.deleteComment = async (comment_id) => {
    const deleteComment = await Comments.findByIdAndDelete({_id: comment_id})
    return deleteComment;
}