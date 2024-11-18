import { useEffect, useState } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import Select, { MultiValue } from "react-select";
import TranslationRuleModal from './TranslationRule';

// Interfaces
interface TranslationRule {
    param: string;
    constraint: string;
    selectedConstraint: string;
    deselectedConstraint: string;
}

interface Element {
    name: string;
}

interface SelectOption {
    value: string;
    label: string;
}

interface VisualSemanticEditorProps {
    // Data props
    elements: Element[];
    selectedElements: string[];
    elementTranslationRules: Record<string, TranslationRule>;
    
    // Event handlers
    onElementsChange: (elements: string[]) => void;
    onTranslationRuleChange: (elementName: string, rule: TranslationRule) => void;
}

export default function VisualSemanticEditor({
    elements,
    selectedElements,
    elementTranslationRules,
    onElementsChange,
    onTranslationRuleChange,
}: VisualSemanticEditorProps) {

    const [selectedRuleElement, setSelectedRuleElement] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Efecto para actualizar el modal cuando cambian las reglas
    useEffect(() => {
        if (selectedRuleElement && showModal) {
            const currentRule = elementTranslationRules[selectedRuleElement];
            if (currentRule) {
                // Actualizar el estado del modal
            }
        }
    }, [elementTranslationRules, selectedRuleElement, showModal]);

    // Event handlers
    const handleElementSelection = (
        selectedOptions: MultiValue<SelectOption>
    ) => {
        const updatedElements = selectedOptions.map(option => option.value);
        onElementsChange(updatedElements);
    };

    const handleOpenModal = (elementName: string) => {
        setSelectedRuleElement(elementName);
        setShowModal(true);
    };

    const handleSaveRule = (elementName: string, rule: TranslationRule) => {
        onTranslationRuleChange(elementName, rule);
        setShowModal(false);
    };

    return (
        <>
            <Form>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>Element Types</Form.Label>
                    <Col sm={10}>
                        <Select<SelectOption, true>
                            options={elements.map(element => ({
                                value: element.name,
                                label: element.name,
                            }))}
                            value={selectedElements.map(element => ({
                                value: element,
                                label: element,
                            }))}
                            onChange={handleElementSelection}
                            isMulti
                            closeMenuOnSelect={false}
                            placeholder="Select element type(s)"
                        />
                    </Col>
                </Form.Group>

                {selectedElements.length > 0 && (
                    <Form.Group as={Row} className="mb-3 align-items-center">
                        <Form.Label column sm={2}>Element Translation Rules</Form.Label>
                        <Col sm={10}>
                            <div className="d-flex flex-wrap gap-2">
                                {selectedElements.map(element => (
                                    <Button
                                        key={element}
                                        variant="outline-primary"
                                        onClick={() => handleOpenModal(element)}
                                    >
                                        {element}
                                    </Button>
                                ))}
                            </div>
                        </Col>
                    </Form.Group>
                )}
            </Form>

            {selectedRuleElement && (
                <TranslationRuleModal
                    show={showModal}
                    elementName={selectedRuleElement}
                    rule={elementTranslationRules[selectedRuleElement] || {
                        param: '',
                        constraint: '',
                        selectedConstraint: '',
                        deselectedConstraint: '',
                    }}
                    onSave={(rule) => handleSaveRule(selectedRuleElement, rule)}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}