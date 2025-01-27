import {useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleUsernameChange(event: any) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event: any) {
    setPassword(event.target.value);
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    console.log("Username: " + username);
    console.log("Password: " + password);
  }

  return (
    <>
      <Container>
        <Row>
          <h1>Welcome to Volt Wave Tech</h1>
          <h3>Sign in to continue</h3>
        </Row>

        <Container>
          <Form>
            <Form.Group as={Row} className="mb-3 mt-4" controlId="formPlaintextEmail">
              <Form.Label column sm="4">
                Email
              </Form.Label>
              <Col sm="8">
                <Form.Control defaultValue="email@example.com"  onInput={handleUsernameChange}/>
              </Col>
            </Form.Group>
            <h6> {username}</h6>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
              <Form.Label column sm="4">
                Password
              </Form.Label>
              <Col sm="8">
                <Form.Control type="password" placeholder="Password" onInput={handlePasswordChange}/>
              </Col>
            </Form.Group>
            <h6> {password}</h6>

            <Button variant="primary" onClick={handleSubmit}>
              Sign in
            </Button>
          </Form>
        </Container>
      </Container>
    </>
  );
}