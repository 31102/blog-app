import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { AuthContext } from "../../contexts/AuthContext";

function Header() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { isAuthenticated, logout } = authContext;

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/home");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <Navbar expand="lg" className="bg-dark text-light">
      <Container fluid>
        <Navbar.Brand href="/home" style={{ color: 'white' }}>BlogApp</Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="navbarScroll" 
          style={{ borderColor: 'white' }} // Change border color of the toggle
        />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link className="text-light" onClick={handleHome}>Home</Nav.Link>
            <Nav.Link className="text-light" onClick={handleProfile}>Profile</Nav.Link>
          </Nav>
          <div className="d-flex flex-column flex-lg-row">
            {isAuthenticated ? (
              <Button variant="danger" className="ms-2" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="success"
                  className="mt-2 ms-2"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  className="mt-2 ms-2"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
