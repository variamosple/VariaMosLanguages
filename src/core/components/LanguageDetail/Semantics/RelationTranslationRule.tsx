import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import MultiValueForm from '../GraphicalMode/Utils/FormUtils/MultiValueForm';

interface RelationTranslationRule {
    params: string[];
    constraint: string;
}

interface RelationTranslationRuleModalProps {
    show: boolean;
    relationName: string;
    rule: RelationTranslationRule;
    selectedElements: string[];
    onSave: (relationName: string, rule: RelationTranslationRule) => void;
    onClose: () => void;
}

export default function RelationTranslationRuleModal({
    show,
    relationName,
    rule,
    selectedElements,
    onSave,
    onClose
}: RelationTranslationRuleModalProps) {

    const [localRule, setLocalRule] = useState<RelationTranslationRule>({
        params: [],
        constraint: ''
    });

    // Actualizar el estado local cuando cambia la regla externa
    useEffect(() => {
        setLocalRule(rule);
    }, [rule]);

    const handleConstraintChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalRule(prev => ({
            ...prev,
            constraint: event.target.value
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSave(relationName, localRule);
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Translation Rule for Relation: {relationName}</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Parameters</Form.Label>
                        <Col sm={9}>
                            <MultiValueForm
                                selectedItems={localRule.params || []}
                                setSelectedItems={params => setLocalRule(prev => ({ ...prev, params }))}
                            />
                            <Form.Text className="text-muted">
                                Select the elements that will be used as parameters in the constraint
                            </Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Constraint</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={localRule.constraint}
                                onChange={handleConstraintChange}
                                placeholder="Enter the constraint expression..."
                            />
                            <Form.Text className="text-muted">
                                Define the constraint using the selected parameters. 
                                Use parameter names directly in the expression.
                            </Form.Text>
                        </Col>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        type="submit"
                        disabled={localRule.params.length === 0 || !localRule.constraint.trim()}
                    >
                        Save Rule
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}