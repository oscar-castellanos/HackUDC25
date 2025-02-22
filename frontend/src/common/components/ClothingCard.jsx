import Card from 'react-bootstrap/Card';
import ProgressBar from 'react-bootstrap/ProgressBar';

const defaultClothing = {
  name: "No name",
  brand: "No brand",
  image: "https://static.zara.net/assets/public/5d1c/c3b3/e8064a30b197/760db88b39af/01618475800-p/01618475800-p.jpg",
  url: "https://static.zara.net/assets/public/5d1c/c3b3/e8064a30b197/760db88b39af/01618475800-p/01618475800-p.jpg",
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
      <Card.Img variant="top" src={clothing.image ? clothing.image : defaultClothing.image} style={{height:"400px"}}/>
      <Card.Body>
        <Card.Title>{clothing.name ? clothing.name : clothing.cloth_name ? clothing.cloth_name : defaultClothing.name}</Card.Title>
        <Card.Subtitle>{clothing.brand ? clothing.brand : defaultClothing.brand}</Card.Subtitle>
        {!(clothing.score) || clothing.score === -1 ? (
          <ProgressBar now={100} label="Can't calculate score" variant="secondary" />
        ) : (
          <ProgressBar
            now={clothing.score}
            label={`${clothing.score}/100`}
            variant={
              clothing.score > 90
                ? "success"
                : clothing.score > 70
                ? "primary"
                : clothing.score > 50
                ? "secondary"
                : clothing.score > 30
                ? "warning"
                : "danger"
            }
          />
        )}
      </Card.Body>
    </Card>
  );
}

export default ClothingCard;