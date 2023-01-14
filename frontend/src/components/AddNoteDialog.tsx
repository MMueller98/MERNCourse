import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { Note } from "../models/note";
import { NoteInput } from "../network/notes_api";
import { useForm } from "react-hook-form";
import * as NotesApi from "../network/notes_api";

interface AddNoteDialogProps {
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
}

// Modal to insert new Notes
//  -> component accepts callback functions that are called on specific event 
//  -> e.g. showDialoag-state update on dismiss of the form
const AddNoteDialog = ({onDismiss, onNoteSaved}: AddNoteDialogProps) => {

    // components from react-hook-form
    const { register, handleSubmit, formState : {errors, isSubmitting}} = useForm<NoteInput>();

    // function thats called onSubmit on AddNote-Form
    async function onSubmit(input:NoteInput) {
        try {
            const noteResponse = await NotesApi.createNote(input);
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
                    Add Note
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* onSubmit we call the the handleSubmit function from react-hook-form and give our onSubmit-function to it */}
                <Form id="addNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        {/* !! takes a value and convert it to boolean (true if set, false if undefined/null) */}
                        <FormControl
                            type="text"
                            placeholder="Title"
                            isInvalid={!!errors.title}
                            {...register("title", {required: "Required"})}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.title?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Text</Form.Label>
                        <FormControl 
                            as="textarea"
                            rows={5}
                            placeholder="Text"
                            {...register("text")}
                        /> 
                    </Form.Group>
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
 
export default AddNoteDialog;