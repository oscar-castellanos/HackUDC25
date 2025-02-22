import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ClothingCard from "./ClothingCard";

const ClothingList = ({ clothing, setCurrentClothingDetail}) => {
  return (
    <Container>
      <Row>
        {clothing.map((cloth, index) => (
          <Col key={index} xs={12} md={4} lg={3}>
            <ClothingCard clothing={cloth} setCurrentClothingDetail={setCurrentClothingDetail} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ClothingList;