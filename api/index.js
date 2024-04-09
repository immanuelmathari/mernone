import express from "express";
import  Mongoose  from "mongoose";
import dotenv from "dotenv";

dotenv.config();


Mongoose.connect(process.env.MONGO)
        .then(() => {
            console.log("connected");
        })
        .catch((err) => {
            console.log(err);
        })

const app = express();
app.listen(3000, ()=>{
    console.log('server is running on port 3000');
});
