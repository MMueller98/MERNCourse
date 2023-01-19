import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
// without further specification, morgan shows an error here, because it can't find a proper declaration file
//  -> hover over error and it will show "try 'npm i --save-dev @types/morgan'"
//  -> this is the language support package you have to install 
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";

// creates express application
const app = express();

// =========================================================================================================
// EXPRESS MIDDLEWARE:
//  -> piece of code that knows how to handle the request
//  -> have access to request-object, result-object and the next middleware function in request/result-cyclus
//  -> middlewares are called in the order they are defined
//      -> define error middleware after all middleware functions that it
// =========================================================================================================
// prints log of all endpoints we access
app.use(morgan("dev"));

// middleware, so app can recieve JSON-data (e.g. to insert new Notes)
app.use(express.json());

// middleware for session management 
//  -> its important to insert use-statement before routes
app.use(session({
    // secret to sign the session cookie
    //  -> don't hardcode here 
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // how long should cookie live
        maxAge: 60 * 60 * 1000,
    },
    // cookies will refresh automatically if user is signed in
    rolling: true,
    // where to store session data
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

// catches any request that goes to endpoints and pass it to given router
app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);

// middleware for when no route (endpoint) is defined for request 
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// middleware for error handling
//  -> error-handling middleware always takes four arguments
//  -> you must provide four arguments to identify it as an error-handling middleware function.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    // show generic error message
    let errorMessage = "An unknown error occured";
    let statusCode = 500;
    if(isHttpError(error)){
        statusCode = error.status;
        errorMessage = error.message;
    }
    // 500 -> internal server error
    res.status(statusCode).json({error: errorMessage});
})

export default app;