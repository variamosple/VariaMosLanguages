import { Button, Modal } from 'react-bootstrap';

export interface NoBackEndModalProps {
  show: boolean;
  onCancel: () => void;
  confirmLabel?: string;
  confirmButtonVariant?: string;
  cancelLabel?: string;
  cancelButtonVariant?: string;
}

export const NoBackEndModalDefaultProps: NoBackEndModalProps =
  Object.freeze({
    message: '',
    show: false,
    onCancel: () => {},
    onConfirm: () => {},
  });

export default function NoBackEndModal({
  show,
  onCancel,
  cancelButtonVariant = 'secondary',
  cancelLabel = 'Close',
}: NoBackEndModalProps) {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Body>There's no BackEnd linked to that functionnality for now. Sorry for the inconvenience.</Modal.Body>
      <Modal.Footer>
        <Button variant={cancelButtonVariant} onClick={onCancel}>
          {cancelLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
