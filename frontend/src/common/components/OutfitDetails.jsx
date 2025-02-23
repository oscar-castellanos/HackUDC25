import Row from "react-bootstrap/Row";
import ClothingDetails from "./ClothingDetails";
import Col from "react-bootstrap/esm/Col";

const OutfitDetails = ({ outfit }) => {

  // An outfit is an Array of Objects
  // Each Object is a key - value pair
  // The key is a string; Top, Bottom, Shoes, etc.
  // The value is a ClothingDetail object
  // I'll ignore the key and just display the ClothingDetail object

  return (
    <Row style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      <h2 style={{ width: '100%', textAlign: 'center' }}>Outfit Details</h2>
      {outfit.map((clothing, index) => (
        <Col key={index} xs={12} sm={12} md={12} lg={6} xl={3} // Controls responsiveness
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '1rem',
        }}>
          <h3 style={{
            fontWeight: 'bold',
            fontSize: '3.75rem', // fs-3 equivalent
            textAlign: 'center',
            textShadow: '2px 2px 5px rgba(0, 123, 255, 0.8)',
          }} key={index+10000}>{clothing.category ? clothing.category : `Piece N.${index}`}</h3>
          <ClothingDetails key={index+20000} clothing={clothing} />
        </Col>
      ))}
    </Row>
  );
}

export default OutfitDetails;