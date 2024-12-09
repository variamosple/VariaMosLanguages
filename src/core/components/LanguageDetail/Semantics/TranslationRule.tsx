import { useEffect, useState } from "react";
import { Form, Button, Modal } from 'react-bootstrap';

interface TranslationRule {
    param: string;
    constraint: string;
    selectedConstraint: string;
    deselectedConstraint: string;
}

interface TranslationRuleModalProps {
    show: boolean;
    elementName: string;
    rule: TranslationRule;
    onSave: (updatedRule: TranslationRule) => void;
    onClose: () => void;
}

// Modal para editar las propiedades de un elemento
export default function TranslationRuleModal({
    show,
    elementName,
    rule,
    onSave,
    onClose
}: TranslationRuleModalProps ) {

    const [localRule, setLocalRule] = useState<TranslationRule>(rule);

    useEffect(() => {
        setLocalRule(rule);
    }, [rule]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Translation Rules for {elementName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Param</Form.Label>
                        <Form.Control
                            type="text"
                            value={localRule.param}
                            onChange={(e) => setLocalRule({ ...localRule, param: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Constraint</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={localRule.constraint}
                            onChange={(e) => setLocalRule({ ...localRule, constraint: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Selected Constraint</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={localRule.selectedConstraint}
                            onChange={(e) => setLocalRule({ ...localRule, selectedConstraint: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Deselected Constraint</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={localRule.deselectedConstraint}
                            onChange={(e) => setLocalRule({ ...localRule, deselectedConstraint: e.target.value })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={() => onSave(localRule)}>Apply</Button>
            </Modal.Footer>
        </Modal>
    );
}