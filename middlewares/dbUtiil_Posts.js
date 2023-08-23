const post_model = require("../models/post_model");
const user_model = require("../models/user_model");
const comments = require ('../controllers/dbUtil_Comments')
const Posts = post_model;
const User = user_model;
const Comments = comments;


exports.createPost = async (data, user_id) => {
    try {
        const user =  await User.findOne({_id: user_id})
        if (!user) {
            throw new Error ('user not found')
        }
        const newPostData = {
        Description: data.Description,
        AuthorId: user_id,
        Author: user.name,
     }
        return await new Posts(newPostData).save();
       
    } catch (error) {
        throw error
    }
    
}

exports.editPost = async (post_id, data) => {
    const post = await Posts.findByIdAndUpdate(
        {_id: post_id },
        {$set: data},
        {new: true}
    ).select('-_id Description');
    if (!post) throw ('post not found')

    return post;
}

exports.getAllPosts = async () => {
    try {
        const posts = await Posts.find({});

        const allPosts = [];
        for(const post of posts){
            const comments = await Comments.getComments(post._id);
            
            const fullPost = {
                Author: post.Author,
                Description: post.Description,
                Comment: comments
            }
            allPosts.push(fullPost);

        }
        return allPosts;
    } catch (error) {
        throw error
    }
    
}

exports.getPostById = async (post_id) => {
    const post = await Posts.findById({_id: post_id})
    if(!post){
        throw new Error ('post not found')
    }
    const comments = await Comments.getComments(post_id);
    if (!comments) {
        throw ('no comments found')
    }
    const fullPost = {
        Author: post.Author,
        Description: post.Description,
        Comment: comments
        
    }
    return fullPost;
}

exports.deletePost = async (post_id) => {
    const post = await Posts.findByIdAndDelete({_id: post_id});
    return post;
}