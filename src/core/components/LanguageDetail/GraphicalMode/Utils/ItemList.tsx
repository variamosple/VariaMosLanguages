import {useState } from "react";
import { Button, ButtonGroup, Row, Col } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import ConfirmationModal from "./ConfirmationModal";
import "../GraphicalMode.css";

interface ItemWithName {
  name: string;
}

export default function ItemList({ items, setItems, newItem, label, setSelectedItem}) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemWithName>({ name: "" });


  const handleAddItem = () => {
    setItems([...items,newItem])
  }

  const handleRemoveItem = (updatedItems) => {
    setItems(updatedItems);
  };

  const handleRemoveElement = (index: number) => {
    const itemToDelete = items[index];
    if (!itemToDelete.name) {(itemToDelete as ItemWithName).name= `${(label.charAt(0).toUpperCase() + label.substring(1))} ${index+1}`}
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

  const handleOnClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div>
      <Button
        variant="outline-secondary"
        onClick={handleAddItem}
        className="w-100 mb-4 main-btn btn-lg"
        style={{
          fontSize: 14,
        }}
      >
        {`Add new ${label}`}
      </Button>

      {/* Items list*/}
      {(items).map((item, index) => (
        <Row key={index} className="mb-2">
          <Col className="d-flex align-items-center">
            <ButtonGroup className="w-100">
              <Button
                variant="outline-secondary"
                onClick={()=>handleOnClick(item)}
                className="flex-grow-1 secondary-btn btn-sm text-center"
              >
                {item.name || `${(label.charAt(0).toUpperCase() + label.substring(1))} ${index+1}`} {/*if item has no name : render a gneric name "label of itemlist + index" */}
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

      {/* Remove confirmation modal */}
      <ConfirmationModal
        show={showConfirmationModal}
        onCancel={cancelRemoveElement}
        onConfirm={confirmRemoveElement}
        itemName={itemToDelete.name || label}
      />

    </div>
  );
}
