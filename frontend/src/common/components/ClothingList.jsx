import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ClothingCard from "./ClothingCard";

const ClothingList = ({ clothing, setCurrentClothingDetail}) => {
  return (
    <Container fluid>
      <Row xs={1} sm={1} md={1} lg={2} xxl={2} className="mx-auto">
        {clothing.map((cloth, index) => (
          <Col key={index} className={"px-3 py-3"}>
            <ClothingCard key={index} clothing={cloth} setCurrentClothingDetail={setCurrentClothingDetail} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ClothingList;