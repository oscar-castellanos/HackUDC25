import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Button from 'react-bootstrap/Button';

const ClothingDetails = ({ clothing }) => {
  const {
    cloth_name,
    brand,
    url,
    currency,
    current_price,
    original_price,
    color,
    description,
    composition,
    image,
    score,
  } = clothing;

  return (
    <Card className="mb-3">
      {image && <Card.Img variant="top" src={image} alt={cloth_name} />}
      <Card.Body>
        <Card.Title>{cloth_name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{brand}</Card.Subtitle>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroupItem>
          <strong>Color: </strong>{color}
        </ListGroupItem>
        <ListGroupItem>
          <strong>Composition: </strong>{composition}
        </ListGroupItem>
        <ListGroupItem>
          <strong>Price: </strong>
          {currency} {current_price}{' '}
          {original_price && original_price > current_price && (
            <span className="text-muted text-decoration-line-through">
              {currency} {original_price}
            </span>
          )}
        </ListGroupItem>
        <ListGroupItem>
          <strong>Score: </strong>{score}
        </ListGroupItem>
        {url && (
          <ListGroupItem>
            <Button href={url} variant="link" target="_blank" rel="noopener noreferrer">
              More Details
            </Button>
          </ListGroupItem>
        )}
      </ListGroup>
    </Card>
  );
};

export default ClothingDetails;