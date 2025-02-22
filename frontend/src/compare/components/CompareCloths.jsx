import { useState, useEffect } from 'react';
import { ClothingList } from '../../common';


const CompareCloths = ({clothImageURL}) => {

  const backURL = 'http://localhost:8000/clothing_app/visual_search'; // POST {'image_url' : 'http://localhost:8000/media/user_clothing/2021-09-26_17-00-00.jpg'} -> return [ {...} ]

  const [clothData, setClothData] = useState(null);

  useEffect(() => {
    if (!clothImageURL) {
      return;
    }
    fetch(backURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url: clothImageURL }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setClothData(data);
      });
  }, []);



  return (
    <>
      <h2>CompareCloths with URL = {clothImageURL}</h2>
      {!clothData && (<h3>Loading...</h3>)}
      {clothData && (
        <ClothingList clothing={clothData} />
      )}
    </>
    );
}

export default CompareCloths;