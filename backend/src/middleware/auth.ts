import { RequestHandler } from "express";
import createHttpError from "http-errors";

// middleware that checks if user is authenticated
export const requiresAuth: RequestHandler = (req, res, next) => {
    if(req.session.userId){
        next();
    } else{
        // forward error to error handler
        next(createHttpError(401, "User not authenticated"));
    }
}