import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

// make environment variables usable at runtime
export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRET: str()
});
