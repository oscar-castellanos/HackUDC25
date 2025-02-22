import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Button from 'react-bootstrap/Button';

const ClothingDetails = ({ clothing }) => {
  const {
    name,
    price_currency,
    price_current,
    price_original,
    link,
    brand,
    color,
    description,
    composition,
    image_url,
    score,
  } = clothing;

  return (
    <Card className="mb-3">
      {image_url && <Card.Img variant="top" src={image_url} alt={name} />}
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{brand}</Card.Subtitle>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroupItem>
          <strong>Color: </strong>{color}
        </ListGroupItem>
        <ListGroupItem>
          <strong>Composition: </strong>{composition ? JSON.stringify(composition, null, 2) : 'No composition'}
        </ListGroupItem>
        <ListGroupItem>
          <strong>Price: </strong>
          {price_currency} {price_current}{' '}
          {price_original && price_original > price_current && (
            <span className="text-muted text-decoration-line-through">
              {price_currency} {price_original}
            </span>
          )}
        </ListGroupItem>
        <ListGroupItem>
          <strong>Score: </strong>{score}
        </ListGroupItem>
        {link && (
          <ListGroupItem>
            <Button href={link} variant="link" target="_blank" rel="noopener noreferrer">
              More Details
            </Button>
          </ListGroupItem>
        )}
      </ListGroup>
    </Card>
  );
};

export default ClothingDetails;