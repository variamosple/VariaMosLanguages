import { Button, Modal } from 'react-bootstrap';
import { UsersContainer } from './UsersContainer';

export interface SharedUserModalProps {
  languageId?: number;
  show?: boolean;
  onClose?: () => void;
  onShareUser?: (userId: string, languageId: number) => Promise<void>;
}

export default function SharedUserModal({ languageId ,show, onClose, onShareUser }: SharedUserModalProps) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Grant Access to Users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UsersContainer languageId={languageId} onShareUser={onShareUser} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
