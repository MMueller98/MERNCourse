import { InferSchemaType, model, Schema } from "mongoose";

// select: false
//  -> if we retrieve user, email and password are not returned to use
//  -> we have to request email/pw specifically
// unique: true
//  -> make sure that all usernames/emails are unique
const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true, select: false},
    password: { type: String, required: true, select: false},
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);