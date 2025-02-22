import Card from 'react-bootstrap/Card';

const defaultClothing = {
  name: "No name",
  brand: "No brand",
  image: "https://via.placeholder.com/150",
  url: "https://via.placeholder.com/150",
  currency: "$",
  current_price: "55.55",
  original_price: "99.99",
  color: "No color",
  description : "No description",
  composition : {},
  score : -1,
};

const ClothingCard = ({ clothing }) => {
  return (
    <Card>
      <Card.Img variant="top" src={clothing.image ? clothing.image : defaultClothing.image}/>
      <Card.Body>
        <Card.Title>{clothing.name ? clothing.name : clothing.cloth_name ? clothing.cloth_name : defaultClothing.name}</Card.Title>
        <Card.Subtitle>{clothing.brand ? clothing.brand : defaultClothing.brand}</Card.Subtitle>
      </Card.Body>
    </Card>
  );
}

export default ClothingCard;