import { useState, useEffect } from 'react';
import Webcam from './Webcam';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const TmpMain = ({imageURL, setImageURL, userName}) => {
  const [capturedImage, setCapturedImage] = useState(null);


  const navigate = useNavigate();

  console.log("TmpMain called");
  // When the capturedImage changes
  // send a POST request to the backend
  // Send first 50 characters of the image
  useEffect(() => {
    console.log("useEffect called");
    if (capturedImage) {
      console.log("Captured image changed");
      console.log("Captured image: ", capturedImage);
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
          console.log('Success:', data);
          if (data.image_url)
            setImageURL(data.image_url);
        });
    }
  }
  , [capturedImage]);

  return (
    <main>
      <Container>
        <Row>
          <Col>
            <h1>Temp Home</h1>
          </Col>
        </Row>
        <Row>
          <Col>
              {!capturedImage && <Webcam setCapturedImage={setCapturedImage} />}
              {capturedImage && (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="captured-image"
                />
              )}
          </Col>
        </Row>
        {capturedImage && (
        <Row>
          <Col>
              <Button onClick={() => {navigate("/compare")}} variant="primary">
                Compare fabric
              </Button>
          </Col>
          <Col>
              <Button onClick={() => setCapturedImage(null)} variant="danger">
                Take new Image
              </Button>
          </Col>
        </Row>
        )}
        <Row>
          <Col>
              {capturedImage && (
                <p>
                  Captured Image Size = {(
                    (capturedImage.length * 3) /
                    (4 * 1024 * 1024)
                  ).toFixed(2)} MB
                </p>
              )}
          </Col>
          <Col>
              {imageURL && (
                <p>
                  Captured Image Id from {userName} = {imageURL}
                </p>
              )}
          </Col>
        </Row>
      </Container>

    </main>
  );
}

export default TmpMain;