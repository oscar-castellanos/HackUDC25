import { useState, useEffect } from 'react';
import Webcam from './Webcam';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const TmpMain = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  console.log("TmpMain called");
  // When the capturedImage changes
  // send a POST request to the backend
  // Send first 50 characters of the image
  useEffect(() => {
    console.log("useEffect called");
    if (capturedImage) {
      console.log("Captured image changed");
      fetch('http://localhost:8000/clothing_app/user_clothing/Oscar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: "Oscar",
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

  /*
        <h1>Temp Home</h1>
      <div className="webcam-container">
        {!capturedImage && <Webcam setCapturedImage={setCapturedImage} />}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="captured-image"
          />
        )}
      </div>
      <div className="card">
        {capturedImage && (
          <div>
            Captured Image Size = {(
              (capturedImage.length * 3) /
              (4 * 1024 * 1024)
            ).toFixed(2)} MB
          </div>
        )}
        {capturedImage && (
          <pre
            style={{
              width: '800px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              margin: '1rem 0',
            }}
          >
            {capturedImage}
          </pre>
        )}
      </div>
  */

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
              {imageId && (
                <p>
                  Captured Image Id = {imageURL}
                </p>
              )}
          </Col>
        </Row>
      </Container>

    </main>
  );
}

export default TmpMain;