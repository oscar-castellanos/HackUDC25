import ReactWebcam from 'react-webcam';

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
      <div className='webcam'>
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
        <button 
          className="capture-btn" 
          onClick={() => {
            const imageSrc = getScreenshot();
            setCapturedImage(imageSrc);
            }
          }
        >
          Capture photo
        </button>
        )}
        </ReactWebcam>
      </div>
    );
}

export default Webcam;
    