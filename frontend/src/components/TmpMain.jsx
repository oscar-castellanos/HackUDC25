import { useState, useEffect } from 'react';
import Webcam from './Webcam';

const TmpMain = () => {
  const [capturedImage, setCapturedImage] = useState(null);

  console.log("TmpMain called");
  // When the capturedImage changes
  // send a POST request to the backend
  // Send first 50 characters of the image
  useEffect(() => {
    console.log("useEffect called");
    if (capturedImage) {
      console.log("Captured image changed");
      fetch('http://localhost:8000/clothing_app/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: "ImgXXX",
                                detail: capturedImage.substring(0, 50)}),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  }
  , [capturedImage]);

  return (
    <main>
      <h1>Temp Mone</h1>
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
    </main>
  );
}

export default TmpMain;