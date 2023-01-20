import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

// =========================================================================================================
// AUTHENTICATED USER CONTROLLER
//  -> get user data of loggined user
// =========================================================================================================
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    // get ID of current authenticated user
    //  -> this way, the user doesn't have to login again
    //  -> if we delete session from database, user is forced to logout
    const authenticatedUserID = req.session.userId;

    try {
        // get user by ID in session cookie
        const user = await UserModel.findById(authenticatedUserID).select("+email").exec();

        // return user in JSON 
        res.status(200).json(user)
    } catch (error) {
        console.log("error!")
        next(error);
    }
}

// =========================================================================================================
// SIGNUP CONTROLLER
//  -> code for handling signup request of users
// =========================================================================================================
// interface for signup-body
interface SignUpBody{
    username?: string,
    email?: string,
    password?: string,
}

// signup endpoint
export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> =async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    // never use pw in plaintext
    const passwordRaw = req.body.password;

    try {
        // username, email, pw not set
        if(!username || !email || !passwordRaw){
            throw createHttpError(400, "Parameters missing");
        }

        // if username found in database, we know that it already exists
        const existingUserName = await UserModel.findOne({username: username}).exec();
        if(existingUserName){
            throw createHttpError(409, "Username already taken. Please choose a different one of log in instead.");
        }
        // if email found in database, we know that a user with this email already exists
        const existingEmail = await UserModel.findOne({username: username}).exec();
        if(existingEmail){
            throw createHttpError(409, "Username with this email adresse already exists. Please log in instead.");
        }
        
        // hash passwort and save new user in database
        const passwordHashed = await bcrypt.hash(passwordRaw, 10);
        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed
        });

        // establish session for user 
        req.session.userId = newUser._id;

        // send new created User back to user
        res.status(201).json(newUser);

    } catch (error) {
        next(error);
    }
};

// =========================================================================================================
// LOGIN CONTROLLER
//  -> code for handling signup request of users
// =========================================================================================================
interface LoginBody {
    username?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
     const username = req.body.username;
     const password = req.body.password;

     try {
        if(!username || !password){
            throw createHttpError(400, "Parameters missing");
        }

        // select password and email to request, because on default we exclude them
        const user = await UserModel.findOne({username: username}).select("+password +email").exec();
        if(!user){
            throw createHttpError(401, "Invalid credentials");
        }

        // compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            throw createHttpError(401, "Invalid credentials");
        }

        // establish session 
        req.session.userId = user._id;
        
        // return user to frontend
        res.status(201).json(user);
        
     } catch (error) {
        next(error);
     }
}

// =========================================================================================================
// LOGOUT USER CONTROLLER
//  -> destroy user session
// =========================================================================================================
export const logout: RequestHandler = async (req, res, next) => {
    // session is also getting deleted in database
    req.session.destroy(error => {
        if(error){
            next(error)
        }else{
            // no body, so call sendStatus instead of just status
            res.sendStatus(200);
        }
    })
}