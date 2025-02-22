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
  const [prompt, setPrompt] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isDoubleHidden, setIsDoubleHidden] = useState(true);
  const [infoType, setInfoType] = useState("image");
  

  setTimeout(() => {
    if (isHidden)
      setIsHidden(false);
  }, 1600);

  setTimeout(() => {
    if (isDoubleHidden)
      setIsDoubleHidden(false);
  }, 4000);

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

  function startFromPrompt(event) {
    event.preventDefault();
    const prompt = event.target[0].value;
    if (!prompt) {
      return;
    }
    setPrompt(prompt);
    setIsStarted(true);
    setInfoType("prompt");
  }


  return (
    <main>
      <Container >
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
        <Row xxs={1} xs={1} sm={1} md={1} lg={1}>
          <Col>
            <h2>
              <ReactTyped strings={["Start by taking a photo"]} typeSpeed={50} showCursor={false}/>
            </h2>
          </Col>
          <Col>
              <Button onClick={() => setIsStarted(true)} variant="primary">
                Start 📷
              </Button>
          </Col>
          <Col>
            <h2>
              Or {isHidden ? ". . .": (<ReactTyped strings={["uploading a picture of a cool outfit"]} typeSpeed={50} showCursor={false}/>)}
            </h2>
          </Col>
          <Col>
            <Form onSubmit={startFromFile}>
            <Form.Group controlId="formFile">
              <Form.Control type="file" size="lg" accept="image/*" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Start  📁
            </Button>
            </Form>
          </Col>
          <Col>
            <h2>
              Or {isDoubleHidden ? ". . .": (<ReactTyped strings={["writing a prompt with a style you like "]} typeSpeed={50} showCursor={false}/>)}
            </h2>
          </Col>
          <Col>
            <Form onSubmit={startFromPrompt}>
              <Form.Group controlId="formInputPrompt">
                <Form.Control type="text" placeholder="I like a style with..." />
              </Form.Group>
              <Button variant="primary" type="submit">
                Start 📝
              </Button>
            </Form>
          </Col>
        </Row>
        )}
        {isStarted && infoType === 'image' && (
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
        {isStarted && infoType === 'prompt' && (
        <>
        <Row>
          <Col>
            <h2>
              You have chosen the prompt: "{prompt}"
            </h2>
          </Col>
        </Row>
        <Row xs={1} md={1} lg={3}>
          <Col>
              <Button onClick={() => {navigate("/compare")}} variant="primary">
                Compare fabric
              </Button>
          </Col>
          <Col>
              <Button onClick={() => {navigate("/search")}} variant="primary">
                Recomend me a new outfit
              </Button>
          </Col>
          <Col>
              <Button onClick={() => {setPrompt(""); setIsStarted(false); setInfoType("image");}} variant="danger">
                Take new Prompt
              </Button>
          </Col>
        </Row>
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
              <Button onClick={() => {navigate("/search")}} variant="primary">
                Recomend me a new outfit
              </Button>
          </Col>
          <Col>
              <Button onClick={() => {setCapturedImage(null); setIsStarted(false);}} variant="danger">
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