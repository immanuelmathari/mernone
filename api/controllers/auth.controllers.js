import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";

export const signup = async (req,res,next) => {
    const {username,email,password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({username,email,password:hashedPassword});
    try
    {
        await newUser.save(); // should save in the database
        res.status(201).json("User created successfully");
    } catch (error)
    {
        next(error);
        // to use the manual status code
        // next(errorHandler(550,'userError'));
    }

}