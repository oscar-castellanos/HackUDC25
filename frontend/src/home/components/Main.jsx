import { useState, useEffect } from 'react';
import Webcam from './Webcam';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { ReactTyped } from 'react-typed';

const Main = ({imageURL, setImageURL, userName}) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isStarted, setIsStarted] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    //console.log("useEffect called");
    if (capturedImage) {
      //console.log("Captured image changed");
      //console.log("Captured image: ", capturedImage);
      fetch(`http://localhost:8000/clothing_app/user_clothing/${userName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userName,
                                image_string: capturedImage}),
      })
        .then((response) => response.json())
        .then((data) => {
          //console.log('Success:', data);
          if (data.image_url)
            setImageURL(data.image_url);
        });
    }
  }
  , [capturedImage]);

  function startFromFile(event) {
    event.preventDefault();
    const file = event.target[0].files[0];
    const reader = new FileReader();
    if (!file) {
      return;
    }
    // if file is not image bye bye
    if (!file.type.startsWith("image")) {
      return;
    }
    // Set the state to started and the captured image to the file
    setIsStarted(true);
    reader.onloadend = function() {
      setCapturedImage(reader.result);
    }
    reader.readAsDataURL(file);
  }


  return (
    <main>
      <Container fluid>
        {!isStarted && (
        <Row>
          <Col>
            <h1>
              Welcome to MY COOL APP NAME
            </h1>
          </Col>
        </Row>
        )}
        {!isStarted && (
        <Row>
          <Col>
            <h2>
              <ReactTyped strings={["Start by taking a photo"]} typeSpeed={100} loop/>
            </h2>
          </Col>
        </Row>
        )}
        {!isStarted && (
        <Row md={1} lg={2}>
          <Col>
              <Button onClick={() => setIsStarted(true)} variant="primary">
                Start 📷
              </Button>
          </Col>
          <Col>
            <Form onSubmit={startFromFile}>
            <Form.Group controlId="formFile">
              <Form.Label>Upload an image</Form.Label>
              <Form.Control type="file" size="lg" accept="image/*" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Start  📁
            </Button>
            </Form>
          </Col>
        </Row>
        )}
        {isStarted && (
        <>
              {!capturedImage && <Webcam setCapturedImage={setCapturedImage} />}
              {capturedImage && (
                <img
                  style={{width: "80%", display: "block", margin: "auto", padding: "20px"}}
                  src={capturedImage}
                  alt="Captured"
                  className="captured-image"
                />
              )}
        </>
        )}
        {capturedImage && (
        <Row xs={1} md={1} lg={3}>
          <Col>
              <Button onClick={() => {navigate("/compare")}} variant="primary">
                Compare fabric
              </Button>
          </Col>
          <Col>
              <Button onClick={() => {navigate("/compare")}} variant="primary">
                Recomend me a new outfit
              </Button>
          </Col>
          <Col>
              <Button onClick={() => setCapturedImage(null)} variant="danger">
                Take new Image
              </Button>
          </Col>
        </Row>
        )}
      </Container>
    </main>
  );
}

export default Main;