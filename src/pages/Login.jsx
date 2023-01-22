import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/AuthService";

const Login = () => {
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
          await authService.credentialsLogin(email, password);
          navigate("/");
        } catch (err) {
          setError(authService.formatErrorCode(err.code));
        }
    }

    const handleFacebookLogin = async (e) => {
      e.preventDefault();
      try {
        await authService.facebookLogin();
        navigate("/");
      } catch (err) {
        setError(authService.formatErrorCode(err.code));
      }
    }

    const handleGoogleLogin = async (e) => {
      e.preventDefault();
      try {
        await authService.googleLogin();
        navigate("/");
      } catch (err) {
        setError(authService.formatErrorCode(err.code));
      }
    }
    return (
        <Container className="bg-transparent">
            <Row className="justify-content-center">
                <Col className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">

                    <Button className="btn-white w-100 mt-4 py-2 rounded-4" onClick={ handleFacebookLogin }>Log in with Facebook <i className="fa-brands fa-square-facebook"></i></Button>
                    <Button className="btn-white w-100 my-4 py-2 rounded-4" onClick={ handleGoogleLogin }>Log in with Google <i className="fa-brands fa-google"></i></Button>
                    
                    <Card className="shadow-lg rounded-4">
                        <Card.Body className="py-4 px-5">
                            <Card.Title className="fs-4 fw-bold mb-4 text-center">Chatap</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-2">Email</Form.Label>
                                    <Form.Control id="name" type="text" className="shadow-sm rounded-4" name="name" autoFocus/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-2">Password</Form.Label>
                                    <Form.Control id="password" type="password" className="form-control shadow-sm rounded-4" name="password"/>
                                </Form.Group>
                                <Button className="btn-blue w-100 rounded-4" type="submit">Log in</Button>
                                {error && <div className="w-100 mt-1 text-center text-danger">{ error }</div>}
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    <p className="text-center text-white mt-3">
                        Don't have an account? <a href="/registration" className="link-info">Sign up</a>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
