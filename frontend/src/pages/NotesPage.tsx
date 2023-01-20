import { Container } from "react-bootstrap";
import NotesPageLoggedInView from "../components/NotesPageLoggedInView";
import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";
import { User } from "../models/user";
import styles from "../styles/NotesPage.module.css";

interface NotesPageProps {
    loggedInUser: User | null,
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
    return (
        <Container className={styles.notesPage}>

            {/* content on the page depending if we are locked in or not */}
            <>
                {loggedInUser
                    ? <NotesPageLoggedInView />
                    : <NotesPageLoggedOutView />
                }
            </>
        </Container>
    );
}

export default NotesPage;