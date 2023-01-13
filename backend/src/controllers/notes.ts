import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import NoteModel from "../models/note";

// =========================================================================================================
// GET CONTROLLER
//  -> code for handling get-requests given by router
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
        // throw bad request error in case noteId in request is not valid MongoDB-ID
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid note ID");
        }

        const note = await NoteModel.findById(noteId).exec();

        // throw bad request error in case note is not found
        if(!note){
            throw createHttpError(404, "Note not found");
        }
        res.status(200).json(note);
    } catch (error) {
        // pass to error-handler middleware
        next(error);
    }
}

// =========================================================================================================
// POST CONTROLLER
//  -> code for handling post-requests given by router
// =========================================================================================================
// create new Note inside of MongoDB Collection
// difference type & interface: 
//  -> 
interface CreateNoteBody{
    title?: string,
    text?: string
}

// set type of input inside <> brackets 
//  -> you have to set type of all parameters (set unknown if you don't know the type)
//  -> hover over RequestHandler to see order of parameters
export const createNotes: RequestHandler<unknown, unknown, CreateNoteBody, unknown> =  async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try {
        // throw bad request error in case title is not set
        if(!title){
            throw createHttpError(400, "Note must have a title");
        }
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

// =========================================================================================================
// PATCH CONTROLLER
//  -> code for handling patch-requests given by router
// =========================================================================================================
// update Note inside of MongoDB Collection
interface UpdateNoteParams{
    noteId: string,
}
interface UpdateNoteBody{
    title?: string,
    text?: string
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> =async (req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    try {
        // throw bad request error in case noteId in request is not valid MongoDB-ID
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid note ID");
        }

        // throw bad request error in case title is not set
        if(!newTitle){
            throw createHttpError(400, "Note must have a title");
        }

        const note = await NoteModel.findById(noteId).exec();

        // throw bad request error in case note is not found
        if(!note){
            throw createHttpError(404, "Note not found");
        }

        note.title = newTitle;
        note.text = newText;

        // update Note in collection and return it 
        const updatedNote = await note.save();
        res.status(200).json(updatedNote);

    } catch (error) {
        next(error);
    }
}

// =========================================================================================================
// DELETE CONTROLLER
//  -> code for handling patch-requests given by router
// =========================================================================================================
export const deleteNote: RequestHandler =async (req, res, next) => {
    const noteId = req.params.noteId;

    try {
        // throw bad request error in case noteId in request is not valid MongoDB-ID
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid note ID");
        }

        // note to be deleted
        const note = await NoteModel.findById(noteId).exec();

        // throw bad request error in case note is not found
        if(!note){
            throw createHttpError(404, "Note not found");
        }

        // remove Note from Collection and return deletion successful status code
        await note.remove();
        return res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}
