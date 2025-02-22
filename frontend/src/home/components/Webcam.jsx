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

const Webcam = ({ setCapturedImage, type = "landscape"}) => {

    return (
      <Container>
        <ReactWebcam
          mirrored 
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: "user",
            ...aspectRatios[type],
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
            }
          }
        >
          Capture photo
        </Button>
        </Col>
        </Row>
        )}
        </ReactWebcam>
      </Container>
    );
}

export default Webcam;
    