import { RequestHandler } from "express";
import createHttpError from "http-errors";

// middleware that checks if user is authenticated
export const requiresAuth: RequestHandler = (req, res, next) => {
    console.log("middleware called")
    console.log("id: " + req.session.id)
    if(req.session.id){
        console.log("pass")
        next();
    } else{
        console.log("error")
        // forward error to error handler
        next(createHttpError(401, "User not authenticated"));
    }
}