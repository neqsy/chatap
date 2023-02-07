import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate, Link } from "react-router-dom";
import { credentialsRegister, facebookLogin, googleLogin } from "../services/AuthService";
import { formatErrorCode } from "../services/Helpers";

const Registration = () => {
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFacebookLogin = async (e) => {
    e.preventDefault();
    try {
      await facebookLogin();
      navigate("/");
    } catch (err) {
      setError(formatErrorCode(err.code));
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      await googleLogin();
      navigate("/");
    } catch (err) {
      setError(formatErrorCode(err.code));
    }
  };

  const handleImageChange = async (e) => {
    setIsImageSelected(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const avatar = e.target[3].files[0];

    try {
      setError("");
      setLoading(true);
      await credentialsRegister(displayName, email, password, avatar);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      if (err.message === "Display name empty" || err.message ==="Email empty" || err.message === "Password empty")
        setError(err.message);
      else
        setError(formatErrorCode(err.code));
    }
  };

  return (
    <Container className="bg-transparent">
      <Row className="justify-content-center">
        <Col className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
          <Button
            className="btn-white w-100 mt-4 py-2 rounded-4"
            onClick={ handleFacebookLogin }
          >
            Log in with Facebook{" "}
            <i className="fa-brands fa-square-facebook"></i>
          </Button>
          <Button
            className="btn-white w-100 my-4 py-2 rounded-4"
            onClick={ handleGoogleLogin }
          >
            Log in with Google <i className="fa-brands fa-google"></i>
          </Button>

          <Card className="shadow-lg rounded-4">
            <Card.Body className="py-4 px-5">
              <Card.Title className="fs-4 fw-bold mb-4 text-center">
                Chatap
              </Card.Title>
              <Form onSubmit={ handleSubmit }>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-2">Display name</Form.Label>
                  <Form.Control
                    id="displayname"
                    type="text"
                    className="shadow-sm rounded-4"
                    name="displayname"
                    autoFocus
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-2">Email</Form.Label>
                  <Form.Control
                    id="name"
                    type="text"
                    className="shadow-sm rounded-4"
                    name="name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="mb-2">Password</Form.Label>
                  <Form.Control
                    id="password"
                    type="password"
                    className="form-control shadow-sm rounded-4"
                    name="password"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    id="avatar"
                    style={{ display: "none" }}
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={handleImageChange}
                  ></Form.Control>
                  <Form.Label
                    htmlFor="avatar"
                    className={"text-center w-100 mt-4 py-2 border rounded-4 " + (isImageSelected ? "border-success" : "border-primary")}
                  >
                    <i className="fa-solid fa-user-plus"></i>Add avatar
                  </Form.Label>
                </Form.Group>
                <Button className="btn-blue w-100 rounded-4" type="submit">
                  Register
                </Button>
                {loading && (
                  <div className="w-100 mt-1 text-center text-primary">
                    "Uploading and compressing the image. Please wait..."
                  </div>
                )}
                {error && (
                  <div className="w-100 mt-1 text-center text-danger">
                    { error }
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>

          <p className="text-center text-white mt-3">
            You do have an account?{" "}
            <Link to="/" className="link-info">
              Log in
            </Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;
