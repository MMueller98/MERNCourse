import { RequestHandler } from "express";
import NoteModel from "../models/note";

// =========================================================================================================
// CONTROLLER
//  -> code for handling the request given by router
// =========================================================================================================
// return all Notes of the MongoDB Collection
export const getNotes: RequestHandler =  async (req, res, next) => {
    try {
        // execute find operation -> returns promise
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);

    } catch (error) {
        // pass to error-handler middleware
        next(error);
    }
}

// return one Note with specific ID
export const getNote: RequestHandler =async (req, res, next) => {
    // get noteId from POST-request parameters
    const noteId = req.params.noteId;
    try {
        const note = await NoteModel.findById(noteId).exec();
        res.status(200).json(note);
    } catch (error) {
        // pass to error-handler middleware
        next(error);
    }
}

// create new Note inside of MongoDB Collection
export const createNotes: RequestHandler =  async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try {
        // create new Note to MongoDB collection
        //  -> on create-Method you don't have to call exec()
        const newNote = await NoteModel.create({
            title: title,
            text: text
        });

        // send positive result and return new created Note
        res.status(201).json(newNote);

    } catch (error) {
        // pass to error-handler middleware
        next(error);
    }
}