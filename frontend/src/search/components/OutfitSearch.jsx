import Container from "react-bootstrap/Container";
import { useState, useEffect } from "react";
import { OutfitDetails } from "../../common";
import Spinner from "react-bootstrap/Spinner";
import { ReactTyped } from "react-typed";

const OutfitSearch = ({ currentClothingDetail, setCurrentClothingDetail }) => {
  const [outfitData, setOutfitData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // fetch a POST
  // TO URL: http://localhost:8000/clothing_app/visual_search/outfit_search
  // WITH BODY: { ... }
  // AND returns a list of ClothingDetails
  useEffect(() => {
    if (!currentClothingDetail) {
      return;
    }
    console.log("Current clothing detail: ", currentClothingDetail);
    fetch("http://localhost:8000/clothing_app/visual_search/outfit_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentClothingDetail),
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
          if (outfitData && data.length <= outfitData.length) {
            return;
          }
          setOutfitData(data);
          setIsLoading(false);
        }
      });
  }, []);

  return (
    <>
      <Container fluid className="text-center mt-5 mb-4">
        <h2>
          {isLoading ? (
            <ReactTyped
              strings={[
                "Booting up the system...",
                "Compiling code...",
                "Decrypting mainframe...",
                "Optimizing algorithms...",
                "Syncing data streams...",
                "Calibrating sensors...",
                "Patching the matrix...",
                "Initializing quantum core...",
                "Executing startup sequence...",
                "Charging flux capacitor...",
                "Connecting to the cloud...",
                "Rendering in hyper-speed...",
                "Activating AI protocols...",
                "Enhancing neural networks...",
                "Bribing the progress bar...",
              ]}
              typeSpeed={30}
              showCursor={false}
              loop
            />
          ) : (
            `Check your proposed outfits!`
          )}
        </h2>
      </Container>
      {isLoading && (
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
      {!outfitData && !isLoading && (
        <Container fluid className="text-center">
          <h3>No outfits found for the current item!</h3>
        </Container>
      )}
      {outfitData && (
        <Container fluid>
          {outfitData.map((outfit, index) => (
            <OutfitDetails key={index} outfit={outfit.outfit_parts} />
          ))}
        </Container>
      )}
    </>
  );
};

export default OutfitSearch;
