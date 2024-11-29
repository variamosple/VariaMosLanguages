import { useEffect, useState } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import Select, { MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import TranslationRuleModal from './TranslationRule';
import RelationTranslationRuleModal from './RelationTranslationRule';
import AttributeRuleModal from './AttributeRuleModal';
import HierarchyRuleModal from './hierarchyRuleModal';

// Interfaces
interface TranslationRule {
    param: string;
    constraint: string;
    selectedConstraint: string;
    deselectedConstraint: string;
}

interface RelationTranslationRule {
    params: string[];
    constraint: string;
}

interface AttributeTranslationRule {
    parent: string;
    param: string;
    template: string;
    constraint: string;
}

interface HierarchyTranslationRule {
    nodeRule?: {
        param: string[];
        paramMapping: {
            incoming: boolean;
            var: string;
            node: string;
        };
        constraint: string;
    };
    leafRule?: {
        param: string;
        constraint: string;
    };
}

interface Element {
    name: string;
    properties?: {
        name: string;
    }[];
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
    relationTypes: string[];
    relationTranslationRules: Record<string, RelationTranslationRule>;
    attributeTypes: string[];
    attributeTranslationRules: Record<string, AttributeTranslationRule>[];
    hierarchyTypes: string[];
    hierarchyTranslationRules: Record<string, HierarchyTranslationRule>;
    
    // Event handlers
    onElementsChange: (elements: string[]) => void;
    onTranslationRuleChange: (elementName: string, rule: TranslationRule) => void;
    onRelationsChange: (relations: string[]) => void;
    onRelationTranslationRuleChange: (relationName: string, rule: RelationTranslationRule) => void;
    onAttributeTypesChange: (attributeTypes: string[]) => void;
    onAttributeTranslationRuleChange: (attributeName: string, rule: AttributeTranslationRule) => void;
    onHierarchyTypesChange: (hierarchyTypes: string[]) => void;
    onHierarchyTranslationRuleChange: (hierarchyType: string, rule: HierarchyTranslationRule) => void;
}

export default function VisualSemanticEditor({
    elements,
    selectedElements,
    elementTranslationRules,
    relationTypes,
    relationTranslationRules,
    attributeTypes,
    attributeTranslationRules,
    hierarchyTypes,
    hierarchyTranslationRules,
    onElementsChange,
    onTranslationRuleChange,
    onRelationsChange,
    onRelationTranslationRuleChange,
    onAttributeTypesChange,
    onAttributeTranslationRuleChange,
    onHierarchyTypesChange,
    onHierarchyTranslationRuleChange,
}: VisualSemanticEditorProps) {

    const [selectedRuleElement, setSelectedRuleElement] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [selectedRuleRelation, setSelectedRuleRelation] = useState<string | null>(null);
    const [showRelationModal, setShowRelationModal] = useState(false);

    const [selectedRuleAttribute, setSelectedRuleAttribute] = useState<string | null>(null);
    const [showAttributeModal, setShowAttributeModal] = useState(false);

    const [selectedRuleHierarchy, setSelectedRuleHierarchy] = useState<string | null>(null);
    const [showHierarchyModal, setShowHierarchyModal] = useState(false);

    // Efecto para actualizar el modal cuando cambian las reglas
    useEffect(() => {
        if (selectedRuleElement && showModal) {
            const currentRule = elementTranslationRules[selectedRuleElement];
            if (currentRule) {
                // Actualizar el estado del modal
            }
        }

        if (selectedRuleRelation && showRelationModal) {
            const currentRule = relationTranslationRules[selectedRuleRelation];
            if (currentRule) {
                // Actualizar el estado del modal de relaciones
            }
        }
    }, [elementTranslationRules, selectedRuleElement, showModal, relationTranslationRules, selectedRuleRelation, showRelationModal]);

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

    // Event handlers para relaciones
    const handleOpenRelationModal = (relationName: string) => {
        setSelectedRuleRelation(relationName);
        setShowRelationModal(true);
    };

    const handleSaveRelationRule = (relationName: string, rule: RelationTranslationRule) => {
        onRelationTranslationRuleChange(relationName, rule);
        setShowRelationModal(false);
    };

    const handleOpenAttributeModal = (attributeName: string) => {
        setSelectedRuleAttribute(attributeName);
        setShowAttributeModal(true);
    };

    const handleOpenHierarchyModal = (hierarchyType: string) => {
        setSelectedRuleHierarchy(hierarchyType);
        setShowHierarchyModal(true);
    };

    const handleSaveHierarchyRule = (hierarchyType: string, rule: HierarchyTranslationRule) => {
        onHierarchyTranslationRuleChange(hierarchyType, rule);
        setShowHierarchyModal(false);
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

            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>Relation Types</Form.Label>
                <Col sm={10}>
                    <CreatableSelect<SelectOption, true>
                        options={elements.map(element => ({
                            value: element.name,
                            label: element.name,
                        }))}
                        value={relationTypes.map(relation => ({
                            value: relation,
                            label: relation,
                        }))}
                        onChange={(selectedOptions) =>
                            onRelationsChange(selectedOptions.map(option => option.value))
                        }
                        isMulti
                        closeMenuOnSelect={false}
                        placeholder="Select or add relation type(s)"
                        formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                        onCreateOption={(inputValue) => {
                            // Actualiza el estado con la nueva opción personalizada
                            if (!relationTypes.includes(inputValue)) {
                                onRelationsChange([...relationTypes, inputValue]);
                            }
                        }}
                    />
                </Col>
            </Form.Group>

            {relationTypes.length > 0 && (
                <Form.Group as={Row} className="mb-3 align-items-center">
                    <Form.Label column sm={2}>Relation Translation Rules</Form.Label>
                    <Col sm={10}>
                        <div className="d-flex flex-wrap gap-2">
                            {relationTypes.map(relation => (
                                <Button
                                    key={relation}
                                    variant="outline-secondary"
                                    onClick={() => handleOpenRelationModal(relation)}
                                >
                                    {relation}
                                    {relationTranslationRules[relation] && (
                                        <span className="ms-1">✓</span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </Col>
                </Form.Group>
            )}

            <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>Attribute Types</Form.Label>
            <Col sm={10}>
                <Select<SelectOption, true>
                    options={elements.filter( element => element.properties.length > 0)
                        .map(element => ({
                            value: element.name,
                            label: element.name,
                    }))}
                    value={attributeTypes.map(attribute => ({
                        value: attribute,
                        label: attribute,
                    }))}
                    onChange={(selectedOptions) =>
                        onAttributeTypesChange(selectedOptions.map(option => option.value))
                    }
                    isMulti
                    closeMenuOnSelect={false}
                    placeholder="Select or add attribute type(s)"
                />
            </Col>
            </Form.Group>

            {attributeTypes.length > 0 && (
            <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column sm={2}>Attribute Translation Rules</Form.Label>
                <Col sm={10}>
                    <div className="d-flex flex-wrap gap-2">
                        {attributeTypes.map(attribute => {
                            const hasRules = Object.keys(attributeTranslationRules).some(
                                key => key.startsWith(`${attribute}:`)
                            );
                            return (
                                <Button
                                    key={attribute}
                                    variant="outline-info"
                                    onClick={() => handleOpenAttributeModal(attribute)}
                                >
                                    {attribute}
                                    {hasRules && <span className="ms-1">✓</span>}
                                </Button>
                            );
                        })}
                    </div>
                </Col>
            </Form.Group>
            )}

            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>Hierarchy Types</Form.Label>
                <Col sm={10}>
                    <CreatableSelect<SelectOption, true>
                        options={elements.map(element => ({
                            value: element.name,
                            label: element.name,
                        }))}
                        value={hierarchyTypes.map(type => ({
                            value: type,
                            label: type,
                        }))}
                        onChange={(selectedOptions) =>
                            onHierarchyTypesChange(selectedOptions.map(option => option.value))
                        }
                        isMulti
                        closeMenuOnSelect={false}
                        placeholder="Select or add hierarchy type(s)"
                        formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                        onCreateOption={(inputValue) => {
                            if (!hierarchyTypes.includes(inputValue)) {
                                onHierarchyTypesChange([...hierarchyTypes, inputValue]);
                            }
                        }}
                    />
                </Col>
            </Form.Group>

            {hierarchyTypes.length > 0 && (
            <Form.Group as={Row} className="mb-3 align-items-center">
                <Form.Label column sm={2}>Hierarchy Translation Rules</Form.Label>
                <Col sm={10}>
                    <div className="d-flex flex-wrap gap-2">
                        {hierarchyTypes.map(hierarchyType => (
                            <Button
                                key={hierarchyType}
                                variant="outline-success"
                                onClick={() => handleOpenHierarchyModal(hierarchyType)}
                            >
                                {hierarchyType}
                                {hierarchyTranslationRules[hierarchyType] && (
                                    <span className="ms-1">✓</span>
                                )}
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

        {selectedRuleRelation && (
            <RelationTranslationRuleModal
                show={showRelationModal}
                relationName={selectedRuleRelation}
                rule={relationTranslationRules[selectedRuleRelation] || {
                    params: [],
                    constraint: ''
                }}
                selectedElements={selectedElements}
                onSave={handleSaveRelationRule}
                onClose={() => setShowRelationModal(false)}
            />
        )}

        {selectedRuleAttribute && (
            <AttributeRuleModal
                show={showAttributeModal}
                elementName={selectedRuleAttribute}
                properties={
                    elements
                        .find(e => e.name === selectedRuleAttribute)
                        ?.properties.map(prop => prop.name) || []
                }
                rule={
                    attributeTranslationRules
                }
                onSave={(propertyName, rule) => {
                    onAttributeTranslationRuleChange(propertyName, {
                        ...rule
                    });
                    setShowAttributeModal(false);
                }}
                onClose={() => setShowAttributeModal(false)}
            />
        )}

        {selectedRuleHierarchy && (
            <HierarchyRuleModal
                show={showHierarchyModal}
                hierarchyType={selectedRuleHierarchy}
                rule={hierarchyTranslationRules[selectedRuleHierarchy] || {
                    nodeRule: {
                        param: [],
                        paramMapping: {
                            incoming: false,
                            var: '',
                            node: '',
                        },
                        constraint: '',
                    },
                    leafRule: {
                        param: '',
                        constraint: '',
                    },
                }}
                elements={elements}
                onSave={handleSaveHierarchyRule}
                onClose={() => setShowHierarchyModal(false)}
            />
        )}

        </>
    );
}