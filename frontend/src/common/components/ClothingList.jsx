import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const ClothingList = ({ clothing }) => {
  return (
    <Container>
      <Row>
        {clothing.map((cloth, index) => (
          <Col key={index} xs={12} md={4} lg={3}>
            <ClothingCard clothing={cloth} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ClothingList;