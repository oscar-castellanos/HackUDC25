import { useState, useEffect } from 'react';
import Webcam from './Webcam';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { ReactTyped } from 'react-typed';
import Fade from 'react-bootstrap/Fade';

const Main = ({imageURL, setImageURL, userName, prompt, setPrompt}) => {
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
    const tmp_prompt = event.target[0].value;
    if (!tmp_prompt) {
      return;
    }
    setPrompt(tmp_prompt);
    setIsStarted(true);
    setInfoType("prompt");
  }


  return (
    <main>
      <Container >
        {!isStarted && (
        <Row>
          <Col>
            <h3 className="mt-3 mb-5" style={{textAlign: "center"}}>
              Welcome to
            </h3>
            <Fade in={true} appear={true}>
              <h1 className="mt-3 mb-3" style={{textAlign: "center"}}>
                MY COOL APP NAME
              </h1>
            </Fade>
          </Col>
        </Row>
        )}
        {!isStarted && (
        <div className="shadow-sm p-3 mb-5 bg-white rounded">
          <Row xxs={1} xs={1} sm={1} md={1} lg={1}>
            <Col>
              <h4 className="mt-5 mb-3" style={{textAlign: "center"}}>
                <ReactTyped strings={["Start taking a photo"]} typeSpeed={50} showCursor={false}/>
              </h4>
            </Col>
            <Col>
                <Button style={{display: "flex", textAlign: "center"}} size="lg" onClick={() => setIsStarted(true)} variant="primary">
                  Start 📷  
                </Button>
            </Col>
            <Col>
              <h4 className="mt-4" style={{textAlign: "center"}}>
                or {isHidden ? ". . .": (<ReactTyped strings={["uploading a picture of a cool outfit"]} typeSpeed={50} showCursor={false}/>)}
              </h4>
            </Col>
            <Col>
              <Form onSubmit={startFromFile}>
              <Form.Group controlId="formFile">
                <Form.Control type="file" size="lg" accept="image/*" />
              </Form.Group>
              <Button variant="primary" type="submit" style={{align: "center"}} size="lg">
                Start  📁
              </Button>
              </Form>
            </Col>
            <Col>
              <h4 className ="mt-4" style={{textAlign: "center"}}>
                or {isDoubleHidden ? ". . .": (<ReactTyped strings={["describing a style you like"]} typeSpeed={50} showCursor={false}/>)}
              </h4>
            </Col>
            <Col>
              <Form onSubmit={startFromPrompt}>
                <Form.Group controlId="formInputPrompt">
                  <Form.Control type="text" placeholder="I'm looking for an outfit with..." />
                </Form.Group>
                <Button variant="primary" type="submit" size="lg">
                  Start 📝
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
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
              <Button onClick={() => {navigate("/promptSearch")}} variant="primary">
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