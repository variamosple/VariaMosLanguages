import React from "react";
import { Row, Container, Col } from "react-bootstrap";
import { LanguagePageLayoutProps } from "./index.types";
import Layout from "../Layout";

function LanguagePageLayout({
  children,
}: LanguagePageLayoutProps): JSX.Element {
  const [left, center, right] = React.Children.map(children, (child) => child);

  return (
    <Layout>
      {left}
      <Container>
        <Row> 
          <Col></Col>
          <Col xs={12}>{center}</Col>
          <Col>{right}</Col>  
        </Row>
      </Container>
    </Layout>
  );
}

export default LanguagePageLayout;
