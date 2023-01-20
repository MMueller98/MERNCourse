import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import { User } from './models/user';
import styles from "./styles/NotesPage.module.css";
import * as UsersApi from "./network/users_api";
import NotesPageLoggedInView from './components/NotesPageLoggedInView';
import NotesPageLoggedOutView from './components/NotesPageLoggedOutView';

function App() {
  // states
  const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  
  useEffect(() => {
    // fetch logged in user from users api
    async function fetchLoggedInUser() {
      try {
        const user = await UsersApi.getLoggedInUser();
        // if getLoggedInUser runs without error (user is login) we can set loggedin user
        console.log(user);
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
    // only execute one time when we open the page
  }, []);


  return (
    <div>
      <NavBar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setShowLoginModal(true)}
        onSignUpClicked={() => setShowSignUpModal(true)}
        onLogoutSuccessful={() => setLoggedInUser(null)}
      />
      <Container className={styles.notesPage}>

        {/* content on the page depending if we are locked in or not */}
        <>
        {loggedInUser
        ? <NotesPageLoggedInView />
        : <NotesPageLoggedOutView />
        }
        </>
      </Container>
      {/* Modals */}
      {showSignUpModal &&
          <SignUpModal
            onDismiss={() => setShowSignUpModal(false)}
            onSignUpSuccessful={(user) => {
              setLoggedInUser(user);
              setShowSignUpModal(false);
            }}
          />
      }
      {showLoginModal &&
          <LoginModal
            onDismiss={() => setShowLoginModal(false)}
            onLoginSuccessful={(user) => {
              setLoggedInUser(user);
              setShowLoginModal(false);
            }}
          />
      }
    </div>
  );
}

export default App;
