import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

const Login = () => {
    return (
        <Container className="bg-transparent">
            <Row className="justify-content-center">
                <Col className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">

                    <Button className="btn-white w-100 mt-4 py-2 rounded-4">Log in with Facebook <i class="fa-brands fa-square-facebook"></i></Button>
                    <Button className="btn-white w-100 my-4 py-2 rounded-4">Log in with Google <i class="fa-brands fa-google"></i></Button>
                    
                    <Card className="shadow-lg rounded-4">
                        <Card.Body className="py-4 px-5">
                            <Card.Title className="fs-4 fw-bold mb-4 text-center">Chatap</Card.Title>
                            <Form>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label className="mb-2">Email</Form.Label>
                                    <Form.Control id="name" type="text" className="shadow-sm rounded-4" name="name" autofocus/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label class="mb-2">Password</Form.Label>
                                    <Form.Control id="password" type="password" className="form-control shadow-sm rounded-4" name="password"/>
                                </Form.Group>
                                <Button className="btn-blue w-100 rounded-4">Log in</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    <p class="text-center text-white mt-3">
                        Don't have an account? <a href="/registration" class="link-info">Sign up</a>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
