import app from "./app";
// import environment variables
//  -> evalid makes sure they are defined
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

// connect mongoose to MongoDB database
//  -> we can't use async/await here on first level
mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected");
        app.listen(port, () => {
            console.log(`Server running on port: ${port}`);
        });
    })
    .catch(
        console.error
    );

