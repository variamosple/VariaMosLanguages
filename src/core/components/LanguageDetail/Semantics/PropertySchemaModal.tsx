import { useEffect, useState } from "react";
import { Form, Button, Modal } from 'react-bootstrap';

interface PropertySchema {
    type: {
        index: number;
        key: string;
    }
}

interface PropertySchemaModalProps {
    show: boolean;
    schema: PropertySchema | null;
    onSave: (updatedSchema: PropertySchema) => void;
    onClose: () => void;
}

export default function PropertySchemaModal({
    show,
    schema,
    onSave,
    onClose
}: PropertySchemaModalProps ) {

    const [localSchema, setLocalSchema] = useState<PropertySchema>({
        type: {
            index: schema?.type?.index ?? 0,
            key: schema?.type?.key ?? ''
        }
    });

    useEffect(() => {
        if (schema) {
            setLocalSchema({
                type: {
                    index: schema.type?.index ?? 0,
                    key: schema.type?.key ?? ''
                }
            });
        }
    }, [schema]);

    const handleSave = () => {
        if (localSchema.type) {
            onSave(localSchema);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Property Schema</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Index</Form.Label>
                        <input
                            type="number"
                            value={localSchema.type.index}
                            onChange={(e) => setLocalSchema({ ...localSchema, type: { ...localSchema.type, index: parseInt(e.target.value)} })}
                            style={{ width: '50px', textAlign: 'center' }}
                            className="mx-2"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Key</Form.Label>
                        <Form.Control
                            type="text"
                            value={localSchema.type.key}
                            onChange={(e) => setLocalSchema({ ...localSchema, type: { ...localSchema.type, key: e.target.value } })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    );

};