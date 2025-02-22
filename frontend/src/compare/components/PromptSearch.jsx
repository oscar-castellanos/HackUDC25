import { useState, useEffect } from 'react';
import { ClothingList } from '../../common';
import Spinner from 'react-bootstrap/Spinner';
import { OutfitSearch } from '../../search';

const PromptSearch = ({prompt}) => {
    const backURL = 'http://localhost:8000/clothing_app/prompt_search';

    const [clothData, setClothData] = useState(null);
    const [currentClothingDetail, setCurrentClothingDetail] = useState(null);

    useEffect(() => {
        if (!prompt) {
            return;
        }
        fetch(backURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: prompt }),
        })
            .then((response) => {console.log("Status:", response.status); return response.json()})
            .then((data) => {
                console.log('Success:', data);
                setClothData(data);
            });
    }, []);


    return (
        <>
        <h2>Get clothes from prompt = {prompt}</h2>
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

export default PromptSearch;