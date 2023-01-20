import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import * as UsersApi from "../network/users_api";

interface NavBarLoggedInViewProps {
    user: User
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({user, onLogoutSuccessful}: NavBarLoggedInViewProps) => {
    async function logout() {
        try {
            await UsersApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
    return (
        <>
        <Navbar.Text className="me-2">
            Signed In as: {user.username}
        </Navbar.Text>
        <Button onClick={logout}>
            Logout
        </Button>
        </>
    );
}
 
export default NavBarLoggedInView;