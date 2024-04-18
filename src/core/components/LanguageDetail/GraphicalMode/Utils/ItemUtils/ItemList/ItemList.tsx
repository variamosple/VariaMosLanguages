import { useState } from "react";
import { Button, ButtonGroup, Row, Col } from "react-bootstrap";
import { Trash, Plus } from "react-bootstrap-icons";
import ConfirmationModal from "./ConfirmationModal";
import "../../../GraphicalMode.css";

interface ItemType {
  name?: string;
}

export default function ItemList({ items, setItems, defaultNewItem, itemLabel, setSelectedItem }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemType>({});


  const handleAddItem = () => {
    setItems([...items, defaultNewItem])
  }

  const handleRemoveItem = (index: number) => {
    const itemToDelete = items[index];
    setItemToDelete(itemToDelete);
    setShowConfirmationModal(true);
  };

  const confirmRemoveElement = () => {
    const updatedItems = items.filter((item) => item !== itemToDelete);
    setItems(updatedItems);
    setItemToDelete({});
    setShowConfirmationModal(false);
  };

  const cancelRemoveElement = () => {
    setItemToDelete({});
    setShowConfirmationModal(false);
  };

  const handleOnClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div>
      <Button
        className="mb-3 mt-3"
        variant="primary"
        onClick={handleAddItem} title={`Add new ${itemLabel}`}>
        <Plus className="plus" />
      </Button>

      {(items).map((item, index) => (
        <Row key={index} className="mb-2">
          <Col className="d-flex align-items-center">
            <ButtonGroup className="w-100">
              <Button
                variant="outline-secondary"
                onClick={() => handleOnClick(item)}
                className="flex-grow-1 secondary-btn btn-sm text-center">
                {item.name || `${(itemLabel.charAt(0).toUpperCase() + itemLabel.substring(1))} ${index + 1}`} {/*if item has no name : render a gneric name "itemLabel of itemlist + index" */}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => handleRemoveItem(index)}
                className="flex-grow-0 trash-btn btn-sm">
                <Trash className="trash" />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      ))}

      <ConfirmationModal
        show={showConfirmationModal}
        onCancel={cancelRemoveElement}
        onConfirm={confirmRemoveElement}
        itemName={itemToDelete.name || itemLabel} />
    </div>
  );
}
