import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
// without further specification, morgan shows an error here, because it can't find a proper declaration file
//  -> hover over error and it will show "try 'npm i --save-dev @types/morgan'"
//  -> this is the language support package you have to install 
import morgan from "morgan";

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
app.use(express.json())

// catches any request that goes to endpoint "/api/notes" and pass it to given router
app.use("/api/notes", notesRoutes);

// middleware for when no route (endpoint) is defined for request 
app.use((req, res, next) => {
    next(Error("Endpoint not found!"));
});

// middleware for error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    // show generic error message
    let errorMessage = "An unknown error occured";
    if(error instanceof Error) errorMessage = error.message;
    // 500 -> internal server error
    res.status(500).json({error: errorMessage});
})

export default app;