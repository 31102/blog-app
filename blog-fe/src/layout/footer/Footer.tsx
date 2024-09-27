import { Container, Row, Col, Nav } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light w-100 mt-5 pt-4 pb-4">
      <Container fluid>
        <Row>
          <Col md={4} sm={12}>
            <h5>About Us</h5>
            <p>
              We are dedicated to providing the best blogging platform for sharing
              ideas and connecting with like-minded individuals.
            </p>
          </Col>
          <Col md={4} sm={12}>
            <h5>Quick Links</h5>
            <Nav className="flex-column">
              <Row>
                <Col>
                  <Nav.Link href="/home" className="text-light">Home</Nav.Link>
                  <Nav.Link href="#about" className="text-light">About</Nav.Link>
                </Col>
                <Col>
                  <Nav.Link href="#contact" className="text-light">Contact</Nav.Link>
                  <Nav.Link href="#privacy" className="text-light">Privacy Policy</Nav.Link>
                </Col>
              </Row>
            </Nav>
          </Col>
          <Col md={4} sm={12}>
            <h5>Follow Us</h5>
            <div className="d-flex flex-column flex-md-row">
              <a href="#" className="text-light me-3 mb-2 mb-md-0"><FaFacebook size={20} /></a>
              <a href="#" className="text-light me-3 mb-2 mb-md-0"><FaTwitter size={20} /></a>
              <a href="#" className="text-light me-3 mb-2 mb-md-0"><FaInstagram size={20} /></a>
              <a href="#" className="text-light"><FaLinkedin size={20} /></a>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} BlogApp. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
