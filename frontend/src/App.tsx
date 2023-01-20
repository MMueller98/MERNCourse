import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModal';
import { User } from './models/user';
import * as UsersApi from "./network/users_api";
import NotesPage from './pages/NotesPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPage from './pages/PrivacyPage';
import styles from "./styles/app.module.css";

function App() {
  // states
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);


  useEffect(() => {
    // fetch logged in user from users api
    async function fetchLoggedInUser() {
      try {
        const user = await UsersApi.getLoggedInUser();
        // if getLoggedInUser runs without error (user is login) we can set loggedin user
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
    // only execute one time when we open the page
  }, []);


  return (
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onLoginClicked={() => setShowLoginModal(true)}
          onSignUpClicked={() => setShowSignUpModal(true)}
          onLogoutSuccessful={() => setLoggedInUser(null)}
        />

        {/* React Router */}
        <Container className={styles.pageContainer}>
          <Routes>
            <Route
              path='/'
              element={<NotesPage loggedInUser={loggedInUser} />}
            />
            <Route
              path='/privacy'
              element={<PrivacyPage />}
            />
            {/* Default fallback page */}
            <Route
              path='/*'
              element={<NotFoundPage />}
            />
          </Routes>
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
    </BrowserRouter>
  );
}

export default App;
