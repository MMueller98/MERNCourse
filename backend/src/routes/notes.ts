import express from "express";
import * as NotesController from "../controllers/notes";

// a router object is an isolated instance of middleware and routes
//  -> its like “mini-application,” capable only of performing middleware and routing functions
//  -> router behaves like middleware itself, so you can use it as an argument to app.use()
//  -> we export routers and use them in our express app
const router = express.Router();

// =========================================================================================================
// ROUTES
//  -> call corresponding controller-functions that contain the handling code
// =========================================================================================================
// GET-Operation: return all Notes
router.get("/", NotesController.getNotes);

// GET-Operation: return Note with ID given in url path-parameter
router.get("/:noteId", NotesController.getNote);

// POST-Operation: create new Note with request-parameters and return it
router.post("/", NotesController.createNotes);

// PATCH-Operation: update note with given noteId with request-parameters
router.patch("/:noteId", NotesController.updateNote);

// DELETE-Operation: delete note with given noteId
router.delete("/:noteId", NotesController.deleteNote);

export default router;