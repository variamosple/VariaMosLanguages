import { Modal, Button } from "react-bootstrap";
import ItemListModal from "./ItemListModal";
import { useState } from "react";
import { useLanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";

export default function RestrictionList({
  show,
  handleClose,
  title,
  restrictionType,
  FormComponent,
  newItemTemplate,
}) {
  const {elements, restrictions, setRestrictions} = useLanguageContext();
  const [selectedRestriction, setSelectedRestriction] = useState({});
  const setRestrictionList = (updatedRestrictions) => {
    setRestrictions((prevRestrictions) => ({
      ...prevRestrictions,
      [restrictionType]: updatedRestrictions,
    }));
  };

  const handleAddRestriction = () => {
    const newRestriction = {
      ...newItemTemplate,
    };
    setRestrictions((prevRestrictions) => ({
      ...prevRestrictions,
      [restrictionType]: [...prevRestrictions[restrictionType], newRestriction],
    }));
  };

  const handleUpdateRestriction = (index, updatedRestriction) => {
    const updatedRestrictions = [...restrictions[restrictionType]];
    updatedRestrictions[index] = updatedRestriction;
    setRestrictionList(updatedRestrictions);
  };

  const handleFormSubmit = () => {
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ItemListModal
          items={restrictions[restrictionType]}
          setItems={setRestrictionList}
          onAdd={handleAddRestriction}
          label={restrictionType}
          selectedItem={selectedRestriction}
          setSelectedItem={setSelectedRestriction}
          renderModal={({ show, onClose, selectedItem }) => (
            <FormComponent
              show={show}
              handleClose={onClose}
              selectedRestriction={selectedRestriction} // Pass the selected restriction object to the FormComponent
              elements={elements}
              handleUpdateRestriction={(updatedRestriction) => {
                // Find the index of the selected restriction in the list
                const index = restrictions[restrictionType].findIndex(
                  (item) => item === selectedItem
                );
                // Update the restriction using the index
                handleUpdateRestriction(index, updatedRestriction);
              }}
            />
          )}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleFormSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}