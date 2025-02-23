import { useState, useEffect } from "react";
import { ClothingList } from "../../common";
import Spinner from "react-bootstrap/Spinner";
import { OutfitSearch } from "../../search";
import Container from "react-bootstrap/esm/Container";
import { ReactTyped } from "react-typed";

const PromptSearch = ({ prompt }) => {
  const backURL = "http://localhost:8000/clothing_app/prompt_search";

  const [clothData, setClothData] = useState(null);
  const [currentClothingDetail, setCurrentClothingDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!prompt) {
      return;
    }
    fetch(backURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: prompt }),
    })
      .then((response) => {
        console.log("Status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        if (data) {
          if (data.length === 0) {
            setIsLoading(false);
            return;
          }
          if (clothData && data.length < clothData.length) {
            return;
          }
          setClothData(data);
          setIsLoading(false);
        }
      });
  }, []);

  return (
    <>
      <Container fluid className="text-center">
        <h2>
          {isLoading ? (
            <ReactTyped
              strings={[
                "Loading...",
                "Please wait...",
                "Getting things ready...",
                "Almost there...",
                "Processing...",
              ]}
              typeSpeed={30}
              showCursor={false}
              loop
            />
          ) : (
            `Prompt analysed!`
          )}
        </h2>
      </Container>
      {!clothData && isLoading && (
        <Spinner
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "5rem",
            height: "5rem",
          }}
          animation="border"
        />
      )}
      {!clothData && !isLoading && (
        <Container fluid className="text-center">
          <h3>No clothing found for the current image!</h3>
        </Container>
      )}
      {clothData && !currentClothingDetail && (
        <ClothingList
          clothing={clothData}
          setCurrentClothingDetail={setCurrentClothingDetail}
        />
      )}
      {currentClothingDetail && (
        <OutfitSearch
          currentClothingDetail={currentClothingDetail}
          setCurrentClothingDetail={setCurrentClothingDetail}
        />
      )}
    </>
  );
};

export default PromptSearch;
