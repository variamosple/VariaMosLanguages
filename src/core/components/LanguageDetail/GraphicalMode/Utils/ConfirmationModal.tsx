import { Modal, Button } from "react-bootstrap";

interface ConfirmationModalProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function ConfirmationModal({
  show,
  onCancel,
  onConfirm,
  itemName,
}: ConfirmationModalProps) {    
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Body>
        Are you sure you want to remove the {itemName} ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
