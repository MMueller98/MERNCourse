import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import styles from "./styles/NotesPage.module.css";

function App() {
  // declare state variable for notes and init with empty array
  const [notes, setNotes] = useState<NoteModel[]>([])
  
  // we don't want to update notes on every render
  //  -> useEffect to say when to update notes
  useEffect(() => {
    // seperate method, because useEffect shouldn't be async
    async function loadNotes() {
      try {
        // fetch notes from database
        //  -> we set up "proxy" in package.json to "localhost:5000" so we don't have to specify it here
        //  -> with this we bypass the CORS-error when trying to fetch data from different localhost port
        //  -> if you design public API you could use cors-package to bypass CORS-error
        const response = await fetch("/api/notes", {method: "GET"});

        // parse JSON body out of response
        const notes = await response.json();

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
      <Row xs={1} md={2} xl={3} className="g-4">
        {notes.map((note) => (
          <Col key={note._id}>
            <Note note={note} className={styles.note}/>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default App;
