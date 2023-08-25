import { useContext, useState } from "react";
import { Button, Row } from "react-bootstrap";
import "../GraphicalMode.css";
import { Container } from "react-bootstrap";
import ParentChildList from "./ParentChild/ParentChildList";
import QuantityElementList from "./QuantityElement/QuantityElementList";
import UniqueNameForm from "./UniqueName/UniqueNameForm";
import { LanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";

export default function RestrictionTab() {
  const {restrictions} = useContext(LanguageContext);
  const [showUniqueNameModal, setShowUniqueNameModal] = useState(false);
  const [showParentChildModal, setShowParentChildModal] = useState(false);
  const [showQuantityElementModal, setShowQuantityElementModal] = useState(false);

  return (
    <div>
      <Container>
        <Row>
          <Button
            variant="outline-secondary"
            className="main-btn btn-sm flex-grow-1 mt-3"
            onClick={() => setShowUniqueNameModal(true)}
          >{`Unique_name : ${ restrictions.unique_name.elements.every(subArray => subArray.length === 0)  ? "0" : "1"}`}</Button>
        </Row>
        <Row>
          <Button
            variant="outline-secondary"
            className="main-btn btn-sm flex-grow-1 mt-3"
            onClick={() => setShowParentChildModal(true)}
          >{`Parent_child : ${restrictions.parent_child.length}`}</Button>
        </Row>
        <Row>
          <Button
            variant="outline-secondary"
            className="main-btn btn-sm flex-grow-1 mt-3"
            onClick={() => setShowQuantityElementModal(true)}
          >{`Quantity_element : ${restrictions.quantity_element.length}`}</Button>
        </Row>
      </Container>

      {/* Modals */}
      <UniqueNameForm
        show={showUniqueNameModal}
        handleClose={() => setShowUniqueNameModal(false)}
      />

      <ParentChildList
      show={showParentChildModal}
      handleClose={() => setShowParentChildModal(false)}
      />

      <QuantityElementList
      show={showQuantityElementModal}
      handleClose={() => setShowQuantityElementModal(false)}
      />
    </div>
  );
}