import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import * as NotesApi from "./network/notes_api";
import AddEditNoteDialog from './components/AddEditNoteDialog';
import {FaPlus} from "react-icons/fa";

function App() {
  // declare state variable for notes and init with empty array
  const [notes, setNotes] = useState<NoteModel[]>([])

  // states for loading notes from backend
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

  // state for insert note modal
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

  // state for note-clicked if user want to edit
  //  -> we have to set type explicitely, because we init with null
  const [noteToEdit, setNoteToEdit] = useState<NoteModel|null>(null);
  
  // we don't want to update notes on every render
  //  -> useEffect to say when to update notes
  useEffect(() => {
    // seperate method, because useEffect shouldn't be async
    async function loadNotes() {
      try {
        // show user on frontend that notes are loading
        setShowNotesLoadingError(false);
        setNotesLoading(true);

        // fetch notes via fetchWrapper from database
        //  -> we set up "proxy" in package.json to "localhost:5000" so we don't have to specify it here
        //  -> with this we bypass the CORS-error when trying to fetch data from different localhost port
        //  -> if you design public API you could use cors-package to bypass CORS-error
        const notes = await NotesApi.fetchNotes();

        // update state -> notes getting updated everywhere they are used in the UI
        setNotes(notes);

      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
      }
    }
    // don't forget to call the defined function
    loadNotes();
  
  // dependency array: say when you want to call this function 
  //  -> empty array: just at the first render
  //  -> no array: on every render
  },[]);

  async function deleteNote(note:NoteModel) {
    try {
      // remove note in backend
      await NotesApi.deleteNote(note._id);
      // remove the note we just deleted from the frontend
      setNotes(notes.filter(existingNote => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  // Commponent that shows all Notes fetched from DB
  const notesGrid = 
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
      {notes.map((note) => (
        <Col key={note._id}>
          <Note 
          note={note} 
          className={styles.note}
          onNoteClicked={setNoteToEdit}
          onDeleteNoteClicked={deleteNote}
          />
        </Col>
      ))}
    </Row>
  

  // display a Note component for every note fetched from database
  return (
    <Container className={styles.notesPage}>
      {/* Button to open the add-note-dialog */}
      <Button 
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => setShowAddNoteDialog(true)}>
        <FaPlus />
        Add new Note
      </Button>
      
      {/* check if notes are finished loading and display them in case they are */}
      {notesLoading && <Spinner animation='border' variant='primary' />}
      {showNotesLoadingError && <p>Something went wrong. Please refresh the page</p>}
      {!notesLoading && !showNotesLoadingError && 
        // HTML braclets are called fragments
        //  -> use because you can't use curly-braclets inside of curley-braclets in react
        <>
          { notes.length > 0 ? 
              notesGrid
              : <p>You don't have any notes yet</p>
          }
        </>
      }

      {/* x &&: means that following code is only executed, if x is true */}
      {/* -> we could also give showAddNoteDialog as input for the component and manage state inside the component */}
      {/* -> but then the state would be stored inside component and the content of the form would still be present after you closed it */}
      { showAddNoteDialog && 
        <AddEditNoteDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote) => {
            // creates new Array and adds the notes that are already in the state to the array
            //  -> and add the new Note to it (that was returned by onNoteSaved)
            //  -> setNotes updates the state and rerender the UI with the new Note
            setNotes([...notes, newNote])
            // close Modal
            setShowAddNoteDialog(false);
          }}
        />
      }

      {noteToEdit &&
      <AddEditNoteDialog
        noteToEdit={noteToEdit}
        onDismiss={() => setNoteToEdit(null)}
        onNoteSaved={(updatedNote) => {
          // if the id matches the updatedNote, then display the new content
          setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote))
          // close modal
          setNoteToEdit(null);
        }}
      />
      }
    </Container>
  );
}

export default App;
