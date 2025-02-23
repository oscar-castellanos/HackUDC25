import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

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

// Function to generate a random color
const getRandomColor = () => {
  return `hsl(${Math.random() * 360}, 70%, 50%)`; // Bright and distinguishable colors
};

// Store colors so materials keep the same color if re-rendered
const materialColors = {};

// Assign random colors to materials if they don't already have one
// IS composition is an array do work
if (typeof composition === 'object' && composition.length > 0) {
  composition.forEach(({ material }) => {
    if (!materialColors[material]) {
      materialColors[material] = getRandomColor();
    }
  });
}
const cardStyle = {
  height: '100%', // set a fixed height for the entire card
};
  return (
    <Card className='mb-3' style={cardStyle}>
      {image_url && (
        <Card.Img
          variant='top'
          src={image_url}
          alt={name}
          style={{ width: '50%', display: 'block', margin: '0 auto' }}
        />
      )}
      <Card.Body style={{ height: '20%' }}>
        <Card.Title
          style={{
            fontWeight: 'bold',
            fontSize: '1.875rem', // fs-3 equivalent
            textAlign: 'center',
            textShadow: '2px 2px 5px rgba(0, 123, 255, 0.8)',
          }}
        >
          {name}
        </Card.Title>

        <Card.Subtitle
          style={{
            marginBottom: '0.5rem',
            color: '#6c757d',
            textTransform: 'uppercase',
            fontWeight: '600',
            textAlign: 'center',
            letterSpacing: '1.5px',
          }}
        >
          {brand}
        </Card.Subtitle>

        <Card.Text
          style={{
            fontSize: '1rem', // Standard text size
            color: '#6c757d', // Muted text color (similar to text-muted)
            lineHeight: '1.5', // Increases line height for readability
            marginBottom: '1rem', // Adds space below the description
            textAlign: 'center', // Justifies the text for a clean look
          }}
        >
          {description.substring(0, 100) + (description.length > 100 ? '...' : '')}
        </Card.Text>
      </Card.Body>
      <ListGroup
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Centers the list
          width: '100%',
          height: '40%',
          marginTop: '2rem',
          marginBottom: '2rem',
        }}
      >

<ListGroupItem
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: '1rem 1.5rem',
    borderRadius: '0.375rem',
    boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
    width: '80%',
    marginBottom: '0.75rem',
    fontSize: '1.1rem',
  }}
>
  {/* Title */}
  <strong
    style={{
      color: '#007bff',
      fontWeight: '600',
      marginBottom: '0.5rem',
    }}
  >
    Composition:
  </strong>

  {/* Check if composition exists and has items */}
  {composition && composition.length > 0 ? (
    <>
      {/* Stacked Progress Bar */}
      <ProgressBar
        style={{ width: '100%', height: '20px', backgroundColor: '#e9ecef' }}
      >
        {composition.map(({ material, percentage }, index) => (
          <ProgressBar
            key={index}
            now={percentage}
            label={`${material} (${percentage}%)`}
            style={{
              backgroundColor: materialColors[material], // Assign random color
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '0.8rem',
            }}
          />
        ))}
      </ProgressBar>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        {composition.map(({ material, percentage} , index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                width: '15px',
                height: '15px',
                backgroundColor: materialColors[material], // Use same random color
                display: 'inline-block',
                marginRight: '5px',
                borderRadius: '3px',
              }}
            ></span>
            <span style={{ fontSize: '0.9rem', color: '#343a40' }}>{material} {percentage}%</span>
          </div>
        ))}
      </div>
    </>
  ) : (
    <span style={{ color: '#6c757d', fontStyle: 'italic' }}>No composition available</span>
  )}
</ListGroupItem>
       
        {( price_currency && price_current ) && (
        <ListGroupItem
          style={{
            display: 'flex',
            justifyContent: 'space-evenly', // Spaces the label and value apart
            alignItems: 'center',
            backgroundColor: '#f8f9fa', // Light background color
            padding: '1rem 1.5rem', // Spacing for better readability
            borderRadius: '0.375rem', // Rounded corners
            boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)', // Soft shadow for depth
            width: '80%', // Controls the width of the list item
            marginBottom: '0.75rem', // Adds spacing between items
            fontSize: '1.1rem', // Increases font size for readability
          }}
        >
          <strong
            style={{
              color: '#007bff', // Makes the label blue
              fontWeight: '600', // Slightly bold
            }}
          >
            Price:
          </strong>
          <span
            style={{
              color: '#343a40', // Darker color for the value
            }}
          >
            {price_currency} {price_current}{' '}
            {price_original && price_original > price_current && (
              <span className='text-muted text-decoration-line-through'>
                {price_currency} {price_original}
              </span>
            )}
          </span>
          {link && (
          <Button
              href={link}
              target='_blank'
              rel='noopener noreferrer'
              className='btn-dark text-white fw-bold rounded-pill'
            >
              Go to store 🚀
            </Button>
          )}
        </ListGroupItem>
        )}
        <ListGroupItem
          style={{
            display: 'block',
            justifyContent: 'space-evenly', // Spaces the label and value apart
            alignItems: 'center',
            backgroundColor: '#f8f9fa', // Light background color
            padding: '1rem 1.5rem', // Spacing for better readability
            borderRadius: '0.375rem', // Rounded corners
            boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)', // Soft shadow for depth
            width: '80%', // Controls the width of the list item
            marginBottom: '0.75rem', // Adds spacing between items
            fontSize: '1.1rem', // Increases font size for readability
          }}
        >
          <strong
            style={{
              color: '#007bff', // Makes the label blue
              fontWeight: '600', // Slightly bold
            }}
          >
            Score:
          </strong>
          <span
            style={{
              color: '#343a40', // Darker color for the value
            }}
          >
            {!score || score === -1 ? (
              <ProgressBar
                now={100}
                label="Can't calculate score"
                variant='secondary'
              />
            ) : (
              <ProgressBar
                now={score}
                label={score/100}
                style={{
                  height: '30px',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ddd', // Grey background for contrast
                }}
              >
                <ProgressBar
                  label={score/100}
                  now={score}
                  style={{
                    backgroundColor: `rgb(${255 - score * 2.55}, ${
                      score * 2.55
                    }, 50)`, // Smooth Red to Green transition
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                />
              </ProgressBar>
            )}
          </span>
        </ListGroupItem>
      </ListGroup>
    </Card>
  );
};

export default ClothingDetails;