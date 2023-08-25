import { useState } from "react";
import { Button, ButtonGroup, Row, Col } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import ConfirmationModal from "../Utils/ConfirmationModal";
import "../GraphicalMode.css";

interface ItemWithName {
  name: string;
}

export default function ItemLlistModal({ items, setItems, onAdd, label, renderModal, selectedItem, setSelectedItem}) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemWithName>({ name: "" });
  const [showModal, setShowModal] = useState(false);

  
  const handleRemoveItem = (updatedItems) => {
    setItems(updatedItems);
  };

  const handleRemoveElement = (index: number) => {
    const itemToDelete = items[index];
    setItemToDelete(itemToDelete);
    setShowConfirmationModal(true);
  };

  const confirmRemoveElement = () => {
    const updatedItems = items.filter((item) => item !== itemToDelete);
    handleRemoveItem(updatedItems);
    setItemToDelete({name:""});
    setShowConfirmationModal(false);
  };

  const cancelRemoveElement = () => {
    setItemToDelete({name:""});
    setShowConfirmationModal(false);
  };

  const openModal = (item: string) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedItem("");
    setShowModal(false);
  };

  return (
    <div>
      <Button
        variant="outline-secondary"
        onClick={onAdd}
        className="w-100 mb-4 main-btn btn-lg"
        style={{
          fontSize: 14,
        }}
      >
        {`Add new ${label}`}
      </Button>

      {/* Liste des éléments */}
      {items.map((item, index) => (
        <Row key={index} className="mb-2">
          <Col className="d-flex align-items-center">
            <ButtonGroup className="w-100">
              <Button
                variant="outline-secondary"
                onClick={() => openModal(item)}
                className="flex-grow-1 secondary-btn btn-sm text-center"
              >
                {item.name || `${(label.charAt(0).toUpperCase() + label.substring(1))} ${index+1}`} {/* Render the 'name' property of the item */}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => handleRemoveElement(index)}
                className="flex-grow-0 trash-btn btn-sm"
              >
                <Trash className="trash" />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      ))}

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        show={showConfirmationModal}
        onCancel={cancelRemoveElement}
        onConfirm={confirmRemoveElement}
        itemName={itemToDelete.name}
      />

      {/* Modal */}
      {renderModal({
        show: showModal,
        onClose: closeModal,
        selectedItem,
      })}
    </div>
  );
}