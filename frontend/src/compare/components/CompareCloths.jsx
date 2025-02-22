import { useState, useEffect } from 'react';
import { ClothingList } from '../../common';
import Spinner from 'react-bootstrap/Spinner';
import { OutfitSearch } from '../../search';


const CompareCloths = ({clothImageURL}) => {

  const backURL = 'http://localhost:8000/clothing_app/visual_search'; // POST {'image_url' : 'http://localhost:8000/media/user_clothing/2021-09-26_17-00-00.jpg'} -> return [ {...} ]

  const [clothData, setClothData] = useState(null);
  const [currentClothingDetail, setCurrentClothingDetail] = useState(null);

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
      .then((response) => {console.log("Status:", response.status); return response.json()})
      .then((data) => {
        console.log('Success:', data);
        setClothData(data);
      });
  }, []);



  return (
    <>
      <h2>CompareCloths with URL = {clothImageURL}</h2>
      {!clothData && (
          <Spinner style={{position: 'absolute', top: '50%', left: '50%', width: '5rem', height: '5rem'}} animation="border" />
        )}
      {(clothData && !currentClothingDetail)  && (
        <ClothingList clothing={clothData} setCurrentClothingDetail={setCurrentClothingDetail}/>
      )}
      {currentClothingDetail && (
        <OutfitSearch currentClothingDetail={currentClothingDetail} setCurrentClothingDetail={setCurrentClothingDetail}/>
      )}
    </>
    );
}

export default CompareCloths;