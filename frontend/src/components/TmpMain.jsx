import { useState } from 'react';
import Webcam from './Webcam';

const TmpMain = () => {
  const [capturedImage, setCapturedImage] = useState(null);

  return (
    <main>
      <h1>Temp Main</h1>
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