import  Mongoose  from "mongoose";

const UserSchema = new Mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    avatar : {
        type : String,
        defalut : "../../client/public/the goal.jpg", 
    },
}, {timestamps : true});

const User = Mongoose.model('User',UserSchema);

export default User;