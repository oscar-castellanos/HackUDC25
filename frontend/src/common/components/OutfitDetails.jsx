import Row from "react-bootstrap/Row";
import ClothingDetails from "./ClothingDetails";

const OutfitDetails = ({ outfit }) => {

  // An outfit is an Array of Objects
  // Each Object is a key - value pair
  // The key is a string; Top, Bottom, Shoes, etc.
  // The value is a ClothingDetail object
  // I'll ignore the key and just display the ClothingDetail object

  return (
    <Row>
      <h2>Outfit Details</h2>
      {outfit.map((clothing, index) => (
        <>
          <h3 key={index+10000}>{clothing.category ? JSON.stringify(clothing.category, null, 2) : `Piece N.${index}`}</h3>
          <ClothingDetails key={index} clothing={clothing} />
        </>
      ))}
    </Row>
  );
}

export default OutfitDetails;