import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";

const Registration = () => {
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const avatar = e.target[3].files[0];

        try {
            // create user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            // create unique image name
            const storageRef = ref(storage, res.user.uid);

            await uploadBytesResumable(storageRef, avatar).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    try {
                        // update profile
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL
                        });
    
                        // create user on firestore
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL
                        });
    
                        // create enmpty user chats on firestore
                        await setDoc(doc(db, "userChats", res.user.uid), {});
    
                        // go to home page
                        navigate("/");
                    } catch (err) {
                        console.log(err);
                        setErr(true);
                        setLoading(false);
                    }
                });
            });
        }
        catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
        }
    }    

    return (
        <Container className="bg-transparent">
            <Row className="justify-content-center">
                <Col className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">

                    <Button className="btn-white w-100 mt-4 py-2 rounded-4">Log in with Facebook <i className="fa-brands fa-square-facebook"></i></Button>
                    <Button className="btn-white w-100 my-4 py-2 rounded-4">Log in with Google <i className="fa-brands fa-google"></i></Button>
                    
                    <Card className="shadow-lg rounded-4">
                        <Card.Body className="py-4 px-5">
                            <Card.Title className="fs-4 fw-bold mb-4 text-center">Chatap</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-2">Display name</Form.Label>
                                    <Form.Control id="displayname" type="text" className="shadow-sm rounded-4" name="displayname" autoFocus/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-2">Email</Form.Label>
                                    <Form.Control id="name" type="text" className="shadow-sm rounded-4" name="name"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-2">Password</Form.Label>
                                    <Form.Control id="password" type="password" className="form-control shadow-sm rounded-4" name="password"/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control id="avatar" style={{display: "none"}} type="file"></Form.Control>
                                    <Form.Label htmlFor="avatar" className="text-center w-100 mt-4 py-2 border border-primary rounded-4">
                                        <i className="fa-solid fa-user-plus"></i>Add avatar
                                    </Form.Label>
                                </Form.Group>
                                <Button className="btn-blue w-100 rounded-4" type="submit">Register</Button>
                                {loading && <div className="w-100 mt-1 text-center text-primary">"Uploading and compressing the image. Please wait..."</div>}
                                {err && <div className="w-100 mt-1 text-center text-danger">Something went wrong</div>}
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    <p className="text-center text-white mt-3">
                        You do have an account? <a href="/" className="link-info">Log in</a>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Registration;
