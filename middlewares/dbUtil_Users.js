const user_model = require ('../models/user_model.js')
const Users = user_model

exports.LoginUser = async (user) => {
    try {
        const email = user.email
        const password = user.password
        const client = await Users.findOne({email: email});
        if (!client) {
            throw new Error ('incorrect email or password')
        }
       
        if (client.password != password){
            throw new Error ('incorrect email or password')
        }
        return client;
    } catch (error) {

        throw error;
    }
}


exports.CreateUser = async (data) => {
    return await new Users(data).save();
}

exports.changePassword = async (user_id, oldPassword, newPassword) => {
    try {
        const user = await Users.findOne({_id: user_id})
        const password = user.password
        if (password != oldPassword){
            throw new Error ('passwords do not match')
        }
        user.password = newPassword;
        await user.save();
        return user;

    } catch (error) { 
        throw error
    }
    
}

exports.resetPassword = async (user_id, security_Question, newPassword) => {
    const user = await Users.findOne({_id: user_id})
    
    try {
        
        if (user.security_Question != security_Question) {
            throw new Error('incorrect answer')
        }
        
        user.password = newPassword;
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }

}

exports.getAllUsers = async() => {
    return await Users.find({})
}

exports.deleteUser = async (user_id) => {
    try {
        const user = await Users.findByIdAndDelete({_id: user_id});
        
        return user;
    } catch (error) {
        
        throw ('user not found');
    }
};