import express from "express";
import  Mongoose  from "mongoose";
import dotenv from "dotenv";
import userrouter from "./routes/user.route.js"
import authrouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';

dotenv.config();

Mongoose.connect(process.env.MONGO)
        .then(() => {
            console.log("connected to MongoDB");
        })
        .catch((err) => {
            console.log(err);
        });

// we create dynamic path
const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors());



// Enable CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    // Other CORS headers may be required depending on your application's needs
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // res.cookie()
    next();
  });

//   app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: 'GET,POST,OPTIONS,PUT,PATCH,DELETE',
//     allowedHeaders: 'Content-Type,Authorization',
//     credentials: true,
//   }));


app.listen(3000, ()=>{
    console.log('server is running on port 3000');
});



app.use('/api/user', userrouter);
// previously looked like this
// app.get('/' , (req,res) => {

// })
app.use('/api/auth', authrouter);

app.use('/api/listing', listingRouter);
// so now we create this route

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*' , (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

// this is a middleware
app.use((err,req,res,next) => {
    // we get the status code from the error and if there is none, we set statusCode to 500
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message,
    });

});
