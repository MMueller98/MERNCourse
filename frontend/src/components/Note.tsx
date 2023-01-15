import styles from "../styles/Note.module.css";
import styleUtils from "../styles/utils.module.css";
import { Note as NoteModel } from "../models/note";
import {Card} from "react-bootstrap"
import { formatDate } from "../utils/formatDate";
import {MdDelete} from "react-icons/md";

// type interface for note properties
interface NoteProps{
    note: NoteModel,
    onNoteClicked: (note: NoteModel) => void,
    onDeleteNoteClicked: (note: NoteModel) => void,
    className?: string
}

// whenever an argument you pass to a component function (like note) changes react updates the UI
//  -> works like state
const Note = ({note, onNoteClicked, onDeleteNoteClicked, className} : NoteProps) => {
    // unpack Note properties
    const {
        title,
        text,
        createdAt,
        updatedAt,
    } = note;

    // keep in mind that this is executed on every render
    //  -> look up how to fix in React for expensive operations
    let createdUpdatedText: string;
    if(updatedAt > createdAt){
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    }else{
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }


    // return the UI drawn on the screen
    //  -> property className is not called "class" like in HTML because class is reserved in JS, so it wouldn't work in tsx-file
    return (
        <Card 
        className={`${styles.noteCard} ${className}`}
        onClick={() => onNoteClicked(note)}
        >
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {title}
                    <MdDelete 
                        className="text-muted ms-auto"
                        onClick={(e) => {
                            onDeleteNoteClicked(note);
                            // prevents that the onClick-Listener of the Parent-Element (Card) is getting called to*/
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>
                <Card.Text className={styles.cardText}>
                    {text}
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )
}

export default Note;