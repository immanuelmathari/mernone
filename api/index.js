import express from "express";
import  Mongoose  from "mongoose";
import dotenv from "dotenv";
import userrouter from "./routes/user.route.js"
import authrouter from "./routes/auth.route.js"

dotenv.config();


Mongoose.connect(process.env.MONGO)
        .then(() => {
            console.log("connected");
        })
        .catch((err) => {
            console.log(err);
        })

const app = express();

app.use(express.json());

app.listen(3000, ()=>{
    console.log('server is running on port 3000');
});

app.use('/api/user', userrouter);
app.use('/api/auth', authrouter);
