import Card from 'react-bootstrap/Card';

const ClothingCard = ({ clothing }) => {
  return (
    <Card>
      <Card.Img variant="top" src={clothing.image} />
      <Card.Body>
        <Card.Title>{clothing.cloth_name}</Card.Title>
        <Card.Subtitle>{clothing.brand}</Card.Subtitle>
      </Card.Body>
    </Card>
  );
}

export default ClothingCard;