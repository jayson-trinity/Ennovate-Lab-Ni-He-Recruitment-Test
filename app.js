const express = require('express');
const mongoose = require('mongoose');
const Users = require('./controllers/dbUtil_Users');
const Posts = require('./controllers/dbUtiil_Posts')
const Comments = require ('./controllers/dbUtil_Comments')


const app = express();
const PORT = 8080;


async function connectToMongoDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Ni-He')
        console.log('connected to mongodb successfully ✔ ')
    } catch (error) {
        console.log('error connecting to mongodb', error)
    }
}
connectToMongoDB();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//REGISTER
app.post('/users', async (req, res) => {
    const data = req.body
    try {
        await Users.CreateUser(data);
        res.status(200).send({ message: 'user created sucessfully', data: {
            email: data.email,
            name: data.name,
        }
    })
    } catch (error) {
        res.status(400).send({ message: 'unable to create user'})
    }
})

//login
app.post('/login', async (req, res) => {
    const user = req.body 

    try {
        await Users.LoginUser(user);
        res.status(200).send({ message: 'login successsful'})
    } catch (error) {
        res.status(400).send({ message:error.message})
    }
})

//get all users
app.get('/users', async (req, res) => {
    try {
        const data = await Users.getAllUsers();
        res.status(200).send({ message: 'users retrieved', data: data})
        
    } catch (error) {
        res.status(404).send({ message: 'unable to retrieve users'})
        
    }
})

//change password
app.patch('/users/changePassword/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    const { oldPassword, newPassword } = req.body; 

    try {
        await Users.changePassword(user_id, oldPassword, newPassword);
        res.status(200).send({ message: 'Password change successful' });
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// password reset
app.patch('/users/passwordReset/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    const {security_Question, newPassword} = req.body;
    try {
        await Users.resetPassword(user_id, security_Question, newPassword);
        res.status(200).send({messsge: 'password reset successful'});
    } catch (error) {
        res.status(400).send({message: error.message});   
    }
})

//delete user
app.delete('/users/:user_id', async (req, res) => {
    const user_id = req.params.user_id
    try {
        await Users.deleteUser(user_id);
        res.status(200).send({ message: 'user deleted successfully'})
    } catch (error) {
        res.status(404).send({ message: 'unable to delete user'})
    }

})



//POST
//create post
app.put ('/post/:user_id', async (req, res) => {
    const data = req.body
    const user_id = req.params.user_id
    try {
        //console.log(data)
        let post = await Posts.createPost(data, user_id);
        res.status(200).send({ message: 'post uploaded successfully', data: post})
    } catch (error) {
        res.status(400).send({ message: error.message})
    }
})
//edit Post
app.patch('/post/:post_id', async (req, res) =>{
    const data = req.body
    const post_id = req.params.post_id
    
    try {

        const post = await Posts.editPost(post_id, data);
        res.status(200).send({ message: 'updated successfully', data: post})

    } catch (error) {
        console.log(error)
        res.status(400).send({ message: 'update failed'})
    }
})

//get all posts
app.get('/post', async (req, res) => {
    try {
        const posts = await Posts.getAllPosts();
        res.status(200).send({message:'Posts retrived successfully', data: posts})
    } catch (error) {
        res.status(200).send({ message: error.message})
    }
    
})

//get single post
app.get('/post/:post_id', async (req, res) => {
    const post_id = req.params.post_id
    try {
        const post = await Posts.getPostById(post_id);
        res.status(200).send({message:`post Retrieved`, data: post})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
})

//delete a post
app.delete('/post/delete/:post_id', async (req, res) => {
    const post_id = req.params.post_id
    try {
        await Posts.deletePost(post_id);
        res.status(200).send({message: 'post deleted'})
    } catch (error) {
        res.status(400).send({ message: 'post cannot be deleted'})
    }
})



//comments
//post comment
app.post('/post/comments/:post_id', async(req, res) => {
    const post_id = req.params.post_id
    const data = req.body
    try {
        const comment = await Comments.postComment(data, post_id);
        res.status(200).send({message: 'comment uploaded successfully', data: comment})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
})
//edit comment
app.patch('/post/comments/:comment_id', async (req, res) => {
    const data = req.body;
    const comment_id = req.params.comment_id;
    try {
        const newComment = await Comments.editComment(data, comment_id);
        res.status(200).send({message: 'Comment Updated', data: newComment})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
})
//get comments 
app.get('/post/comments/:comment_id', async(req, res) => {
    const comment_id = req.params.comment_id;
    try {
        const comment = await Comments.getComments(comment_id);
        res.status(200).send({message: 'comments retrieved successfully', data: comment})
    } catch (error) {
        res.status(400).send({message: error.message})   
    }
})

//delete comment
app.delete('/post/comments/:comment_id', async (req, res) => {
    const comment_id = req.params.comment_id
    try {
        await Comments.deleteComment(comment_id)
        res.status(200).send({message: 'Comment deleted'})
    } catch (error) {
        res.status(400).send({message: error.message})
    }
})


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

