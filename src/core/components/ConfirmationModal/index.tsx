import { Button, Modal } from 'react-bootstrap';

export interface ConfirmationModalProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message: string;
  confirmLabel?: string;
  confirmButtonVariant?: string;
  cancelLabel?: string;
  cancelButtonVariant?: string;
}

export const confirmationModalDefaultProps: ConfirmationModalProps =
  Object.freeze({
    message: '',
    show: false,
    onCancel: () => {},
    onConfirm: () => {},
  });

export default function ConfirmationModal({
  show,
  onCancel,
  onConfirm,
  message,
  confirmLabel = 'Yes',
  confirmButtonVariant = 'primary',
  cancelButtonVariant = 'secondary',
  cancelLabel = 'No',
}: ConfirmationModalProps) {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant={confirmButtonVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button variant={cancelButtonVariant} onClick={onCancel}>
          {cancelLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
