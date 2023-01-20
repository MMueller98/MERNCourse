import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";

interface NavBarProps {
    loggedInUser: User | null,
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
    onLogoutSuccessful: () => void,
}

const NavBar = ({loggedInUser, onSignUpClicked, onLoginClicked, onLogoutSuccessful}: NavBarProps) => {
    return (
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Cool Notes App
                </Navbar.Brand>
                {/* responsable for responsive design  */}
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    {/* with href it will always refresh the page -> not good! */}
                    <Nav>
                        {/* as says that we want to render Nav.Link as react-router-dom link 
                            -> this way the styling is Nav.Link but behaviour is react-router-dom link
                        */}
                        <Nav.Link as={Link} to="/privacy">
                            Privacy
                        </Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {loggedInUser 
                        ? <NavBarLoggedInView 
                            user={loggedInUser} onLogoutSuccessful={onLogoutSuccessful}
                        />
                        : <NavBarLoggedOutView 
                            onLoginClicked={onLoginClicked} onSignUpClicked={onSignUpClicked}
                        /> 
                        
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
 
export default NavBar;