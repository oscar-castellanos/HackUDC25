import Container from 'react-bootstrap/Container';
import {useState, useEffect} from 'react';
import { OutfitDetails } from '../../common';


const OutfitSearch = ({currentClothingDetail, setCurrentClothingDetail}) => {

  const [outfitData, setOutfitData] = useState(null);

  // fetch a POST
  // TO URL: http://localhost:8000/clothing_app/visual_search/outfit_search
  // WITH BODY: { ... }
  // AND returns a list of ClothingDetails
  useEffect(() => {
    if (!currentClothingDetail) {
      return;
    }
    console.log("Current clothing detail: ", currentClothingDetail);
    fetch('http://localhost:8000/clothing_app/visual_search/outfit_search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentClothingDetail),
    })
      .then((response) => {console.log("Status:", response.status); return response.json()})
      .then((data) => {
        console.log('Success:', data);
        setOutfitData(data);
      });
  }, []);


  return (
    <>
    <h2>Outfit Search</h2>
    <h3>Current clothing detail {JSON.stringify(currentClothingDetail, null, 2)}</h3>
    {!outfitData && (
      <p>Loading outfit data...</p>
    )}
    {outfitData && (
      <Container>
      <p>Outfit data loaded</p>
      {
        outfitData.map((outfit, index) => (
          <OutfitDetails key={index} outfit={outfit.outfit_parts}/>
        ))
      }
      </Container>
    )}
    </>
  );
};

export default OutfitSearch;