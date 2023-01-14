import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import * as NotesApi from "./network/notes_api";
import AddNoteDialog from './components/AddNoteDialog';

function App() {
  // declare state variable for notes and init with empty array
  const [notes, setNotes] = useState<NoteModel[]>([])

  // state for insert note modal
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  
  // we don't want to update notes on every render
  //  -> useEffect to say when to update notes
  useEffect(() => {
    // seperate method, because useEffect shouldn't be async
    async function loadNotes() {
      try {
        // fetch notes via fetchWrapper from database
        //  -> we set up "proxy" in package.json to "localhost:5000" so we don't have to specify it here
        //  -> with this we bypass the CORS-error when trying to fetch data from different localhost port
        //  -> if you design public API you could use cors-package to bypass CORS-error
        const notes = await NotesApi.fetchNotes();

        // update state -> notes getting updated everywhere they are used in the UI
        setNotes(notes);

      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
    // don't forget to call the defined function
    loadNotes();
  
  // dependency array: say when you want to call this function 
  //  -> empty array: just at the first render
  //  -> no array: on every render
  },[]);
  

  // display a Note component for every note fetched from database
  return (
    <Container>
      {/* Button to open the add-note-dialog */}
      <Button 
        className={`mb-4 ${styleUtils.blockCenter}`}
        onClick={() => setShowAddNoteDialog(true)}>
        Add new Note
      </Button>
      {/* Commponent that shows all Notes fetched from DB */}
      <Row xs={1} md={2} xl={3} className="g-4">
        {notes.map((note) => (
          <Col key={note._id}>
            <Note note={note} className={styles.note}/>
          </Col>
        ))}
      </Row>
      {/* x &&: means that following code is only executed, if x is true */}
      {/* -> we could also give showAddNoteDialog as input for the component and manage state inside the component */}
      {/* -> but then the state would be stored inside component and the content of the form would still be present after you closed it */}
      { showAddNoteDialog && 
        <AddNoteDialog
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
    </Container>
  );
}

export default App;
