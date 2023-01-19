import mongoose from "mongoose";

// .d.ts are typedefinition files 
//  -> @types/.. packages are basically .d.ts-files
//  -> set path in tsconfig.json in typeRoots
//  -> also add "ts-node": {"files": true} to tsconfig

declare module "express-session"{
    interface SessionData {
        userId: mongoose.Types.ObjectId;
    }
}