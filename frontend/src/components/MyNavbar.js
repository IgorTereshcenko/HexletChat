import useAuth from "../context/Auth";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

const MyNavbar = () => {

    const { logOut, user } = useAuth();

    return (
        <Navbar bg="white" className="shadow-sm">
            <Container>
                <Navbar.Brand href="/login">Hexlet Chat</Navbar.Brand>
                {!!user && <Button onClick={logOut}>Выйти</Button>}
            </Container>
      </Navbar>
    )
}

export default MyNavbar;