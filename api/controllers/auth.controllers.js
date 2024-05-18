import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req,res,next) => {
    const {username,email,password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username,email,password:hashedPassword});
    try
    {
        await newUser.save(); // should save in the database
        // res.status(201).json("User created successfully");
        res.status(201).json({message : "User created successfully"});
    } catch (error)
    {
        next(error);
        // to use the manual status code
        // next(errorHandler(550,'userError'));
    }

};

export const signin = async (req,res,next) => {
    const {email,password} = req.body;

    try{
        const validUser = await User.findOne({email});
        if (!validUser) return next(errorHandler(404, "User not found"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

        const token = jwt.sign({id: validUser._id} , process.env.JWT_SECRET );

        console.log(token);

        const {password:pass, ...rest} = validUser._doc;
        const expiryDate = new Date(Date.now() + 3600000);

        res
        .cookie("access_token", token , {httpOnly : true, expires: expiryDate})
        .status(200)
        .json(rest);
    }
    catch (error)
    {
        next(error);
    }
};

export const google = async (req,res,next) => {
    try {
        const email = await User.findOne({email : req.body.email});
        if (email) {
            const token = jwt.sign({id: email._id}, process.env.JWT_SECRET);
            // const {password, ...rest} = email.toObject();
            const {password:pass , ...rest} = email._doc;
            // res.cookie('access_token', token, {httpOnly:true}).status(200).json(rest);
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour
            res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
            console.log(token);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password: pass2, ...rest} = newUser._doc;
            // res.cookie('access_token', token, {httpOnly:true}).status(200).json(rest);
            const expiryDate = new Date(Date.now() + 3600000);
            res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
            }

        }catch (error) 
        {
            next(error);
        }
    };
