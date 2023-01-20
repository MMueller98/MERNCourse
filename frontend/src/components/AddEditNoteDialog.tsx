import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { NoteInput } from "../network/notes_api";
import { useForm } from "react-hook-form";
import * as NotesApi from "../network/notes_api";
import TextInputField from "./form/TextInputField";

interface AddEditNoteDialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
}

// Modal to insert new Notes
//  -> component accepts callback functions that are called on specific event 
//  -> e.g. showDialoag-state update on dismiss of the form
const AddEditNoteDialog = ({noteToEdit, onDismiss, onNoteSaved}: AddEditNoteDialogProps) => {

    // components from react-hook-form
    const { register, handleSubmit, formState : {errors, isSubmitting}} = useForm<NoteInput>({
        // set default values -> "old content" from note to edit or empty if you want to add a note
        defaultValues: {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || ""
        }
    });

    // function thats called onSubmit on AddNote-Form
    async function onSubmit(input:NoteInput) {
        try {
            let noteResponse: Note;
            // distinguish between update and create operation
            if(noteToEdit){
                noteResponse = await NotesApi.updateNote(noteToEdit._id, input);
            }else{
                noteResponse = await NotesApi.createNote(input);
            }
            onNoteSaved(noteResponse)
            
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return ( 
        // on hide resembles everythin that closes the model (close-button, clicking outside the modal, etc.)
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? "Edit Note" : "Add Note"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* onSubmit we call the the handleSubmit function from react-hook-form and give our onSubmit-function to it */}
                <Form id="addNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    {/* Self created TextInputField Interface Component */}
                    <TextInputField 
                        name="title"
                        label="Title"
                        type="text"
                        placeholder="Title"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.title}
                    />

                    <TextInputField 
                        name="text"
                        label="Text"
                        type="textarea"
                        rows={5}
                        placeholder="Text"
                        register={register}
                    />
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="addNoteForm"
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
     );
}
 
export default AddEditNoteDialog;