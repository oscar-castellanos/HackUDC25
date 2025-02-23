import { useState, useEffect } from 'react';

import ReactWebcam from 'react-webcam';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const aspectRatios = {
  landscape: {
    width: 1920,
    height: 1080,
  },
  portrait: {
    width: 1080,
    height: 1920,
  },
};

const Webcam = ({ setCapturedImage }) => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  function useWindowDimensions() {
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  }

  const { height, width } = useWindowDimensions();

  function calculateDimensions(width, height) {
    const type = width > height ? "landscape" : "portrait";

    const w_factor = (width * 0.9) / aspectRatios[type].width;
    const h_factor = (height * 0.9) / aspectRatios[type].height;
    const factor = Math.min(w_factor, h_factor, 1);
    //console.log("factor: ", factor);
    //console.log("width: ", aspectRatios[type].width * factor);
    //console.log("height: ", aspectRatios[type].height * factor);
    return {
      width: aspectRatios[type].width * factor,
      height: aspectRatios[type].height * factor,
    };
  }

  return (
    <Container fluid>
      <ReactWebcam
        mirrored
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: "user",
          ...calculateDimensions(width, height),
        }}
      >
        {({ getScreenshot }) => (
          <Row>
            <Col>
              <Button
                variant="primary"
                onClick={() => {
                  const imageSrc = getScreenshot();
                  setCapturedImage(imageSrc);
                }}
              >
                Capture photo
              </Button>
            </Col>
          </Row>
        )}
      </ReactWebcam>
    </Container>
  );
};

export default Webcam;
    