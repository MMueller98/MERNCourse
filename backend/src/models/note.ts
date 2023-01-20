import { InferSchemaType, model, Schema } from "mongoose";

// create Schema for Notes
const noteSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true},
    title: {type: String, required: true},
    text: {type: String}, 
}, {timestamps: true});

// create Note-Type for TypeScript on basis of noteSchema
type Note = InferSchemaType<typeof noteSchema>;

// export mongoose model
//  -> creates a collection with pluralized name automatically 
export default model<Note>("Note", noteSchema);