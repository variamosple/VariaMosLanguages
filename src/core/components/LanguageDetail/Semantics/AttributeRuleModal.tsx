import { useEffect, useState } from "react";
import { Form, Button, Modal, ListGroup } from 'react-bootstrap';

interface AttributeTranslationRule {
    parent: string;
    param: string;
    template: string;
    constraint: string;
}

interface AttributeTranslationRuleModalProps {
    show: boolean;
    elementName: string;
    properties: string[];
    rule?: Record<string, AttributeTranslationRule>[];
    onSave: (propertyName: string, updatedRule: AttributeTranslationRule) => void;
    onClose: () => void;
}

export default function AttributeRuleModal({
    show,
    elementName,
    properties,
    rule,
    onSave,
    onClose
}: AttributeTranslationRuleModalProps) {
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
    const [localRule, setLocalRule] = useState<AttributeTranslationRule>({
        parent: '',
        param: '',
        template: '',
        constraint: ''
    });

    // Estado para controlar la etapa del modal
    const [modalStage, setModalStage] = useState<'propertySelection' | 'ruleEdition'>('propertySelection');

    useEffect(() => {
        // Reiniciar estados cuando se abre el modal
        if (show) {
            setSelectedProperty(null);
            setModalStage('propertySelection');
            setLocalRule({
                parent: '',
                param: '',
                template: '',
                constraint: ''
            });
        }
    }, [show]);

    // useEffect(() => {
    //     // Si hay una regla existente, cargarla
    //     if (rule) {
    //         setLocalRule(rule);
    //     }
    // }, [rule]);

    const handlePropertySelection = (property: string) => {
        setSelectedProperty(property);
        if (rule[property]) {
            setLocalRule(rule[property]);
        }
        setModalStage('ruleEdition');
    };

    const handleSave = () => {
        if (selectedProperty) {
            onSave(selectedProperty, localRule);
            onClose();
        }
    };

    const renderPropertySelection = () => (
        <Modal.Body>
            <h5>Select a Property for {elementName}</h5>
            <ListGroup>
                {properties.map(property => (
                    <ListGroup.Item 
                        key={property} 
                        action 
                        onClick={() => handlePropertySelection(property)}
                    >
                        {property}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Modal.Body>
    );

    const renderRuleEdition = () => (
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Selected Property: {selectedProperty}</Form.Label>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Parent</Form.Label>
                    <Form.Control
                        type="text"
                        value={localRule.parent}
                        onChange={(e) => setLocalRule({ ...localRule, parent: e.target.value })}
                        placeholder="Enter parent identifier"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Param</Form.Label>
                    <Form.Control
                        type="text"
                        value={localRule.param}
                        onChange={(e) => setLocalRule({ ...localRule, param: e.target.value })}
                        placeholder="Enter parameter name"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Template</Form.Label>
                    <Form.Control
                        type="text"
                        value={localRule.template}
                        onChange={(e) => setLocalRule({ ...localRule, template: e.target.value })}
                        placeholder="Enter template"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Constraint</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={localRule.constraint}
                        onChange={(e) => setLocalRule({ ...localRule, constraint: e.target.value })}
                        placeholder="Enter constraint logic"
                    />
                </Form.Group>
            </Form>
        </Modal.Body>
    );

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {modalStage === 'propertySelection' 
                        ? `Select Property for ${elementName}` 
                        : `Edit Attribute Translation Rule for ${selectedProperty}`
                    }
                </Modal.Title>
            </Modal.Header>
            
            {modalStage === 'propertySelection' 
                ? renderPropertySelection() 
                : renderRuleEdition()}
            
            <Modal.Footer>
                {modalStage === 'propertySelection' ? (
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                ) : (
                    <>
                        <Button 
                            variant="secondary" 
                            onClick={() => setModalStage('propertySelection')}
                        >
                            Back to Properties
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Apply Rule
                        </Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
}