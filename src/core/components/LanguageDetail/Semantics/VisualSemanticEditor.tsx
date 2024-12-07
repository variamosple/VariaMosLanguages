import { useEffect, useState } from 'react';
import { Form, Col, Row, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import TranslationRuleModal from './TranslationRule';
import RelationTranslationRuleModal from './RelationTranslationRule';
import AttributeRuleModal from './AttributeRuleModal';
import HierarchyRuleModal from './hierarchyRuleModal';
import { BiHelpCircle } from "react-icons/bi";
import PropertySchemaModal from './PropertySchemaModal';

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

interface RelationPropertySchema {
    type: {
      index: number;
      key: string;
    }
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
    relationships: Array<{
        properties?: Array<{
            name: string;
            possibleValues?: string[];
        }>;
    }>;
    relationTypes: string[];
    relationTranslationRules: Record<string, RelationTranslationRule>;
    relationPropertySchema?: RelationPropertySchema;
    relationReificationTypes: string[];
    attributeTypes: string[];
    attributeTranslationRules: Record<string, AttributeTranslationRule>[];
    hierarchyTypes: string[];
    hierarchyTranslationRules: Record<string, HierarchyTranslationRule>;
    
    // Event handlers
    onElementsChange: (elements: string[]) => void;
    onTranslationRuleChange: (elementName: string, rule: TranslationRule) => void;
    onRelationsChange: (relations: string[]) => void;
    onRelationTranslationRuleChange: (relationName: string, rule: RelationTranslationRule) => void;
    onRelationPropertySchemaChange?: (schema: RelationPropertySchema) => void;
    onRelationReificationTypesChange: (types: string[]) => void;
    onAttributeTypesChange: (attributeTypes: string[]) => void;
    onAttributeTranslationRuleChange: (attributeName: string, rule: AttributeTranslationRule) => void;
    onHierarchyTypesChange: (hierarchyTypes: string[]) => void;
    onHierarchyTranslationRuleChange: (hierarchyType: string, rule: HierarchyTranslationRule) => void;
}

export default function VisualSemanticEditor({
    elements,
    selectedElements,
    elementTranslationRules,
    relationships,
    relationTypes,
    relationTranslationRules,
    relationPropertySchema,
    relationReificationTypes,
    attributeTypes,
    attributeTranslationRules,
    hierarchyTypes,
    hierarchyTranslationRules,
    onElementsChange,
    onTranslationRuleChange,
    onRelationsChange,
    onRelationTranslationRuleChange,
    onRelationPropertySchemaChange,
    onRelationReificationTypesChange,
    onAttributeTypesChange,
    onAttributeTranslationRuleChange,
    onHierarchyTypesChange,
    onHierarchyTranslationRuleChange,
}: VisualSemanticEditorProps) {

    const [selectedRuleElement, setSelectedRuleElement] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [selectedRuleRelation, setSelectedRuleRelation] = useState<string | null>(null);
    const [showRelationModal, setShowRelationModal] = useState(false);

    const [showRelationPropertySchemaModal, setShowRelationPropertySchemaModal] = useState(false);

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

    const handleOpenRelationPropertySchemaModal = () => {
        setShowRelationPropertySchemaModal(true);
    };

    const handleSaveRelationPropertySchema = (schema: RelationPropertySchema) => {
        onRelationPropertySchemaChange(schema);
        setShowRelationPropertySchemaModal(false);
    }

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
                {/* Elements */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                        Element Types
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip>
                                    Define the element types that are translated independently of other elements in the model. These types correspond to those declared in the abstract syntax and must be listed here for further semantic translation. Ensure all required element types are included.
                                </Tooltip>
                            }
                        >
                            <span className="ms-2 text-info" style={{cursor: 'help'}}>
                                <BiHelpCircle />
                            </span>
                        </OverlayTrigger>
                    </Form.Label>
                    <Col sm={9}>
                        <div className="d-flex flex-wrap gap-2">
                            {elements.map(element => (
                                <Button
                                    key={element.name}
                                    variant={selectedElements.includes(element.name) ? "primary" : "outline-primary"}
                                    onClick={() => {
                                        const currentSelection = [...selectedElements];
                                        if (currentSelection.includes(element.name)) {
                                            const index = currentSelection.indexOf(element.name);
                                            currentSelection.splice(index, 1);
                                        } else {
                                            currentSelection.push(element.name);
                                        }
                                        onElementsChange(currentSelection);
                                    }}
                                >
                                    {element.name}
                                    {selectedElements.includes(element.name) && (
                                        <span className="ms-1">✓</span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </Col>
                </Form.Group>

                {selectedElements.length > 0 && (
                    <Form.Group as={Row} className="mb-3 align-items-center">
                        <Form.Label column sm={3}>
                            Element Translation Rules
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Specify the translation rules for each element type listed in 'elementTypes'. Define attributes such as 'param' (placeholder for the element's ID), 'constraint' (default formula), and optional 'selectedConstraint' or 'deselectedConstraint' for specific states. Use these rules to construct the logical representation of the elements in the target semantics.
                                    </Tooltip>
                                }
                            >
                                <span className="ms-2 text-info" style={{cursor: 'help'}}>
                                    <BiHelpCircle />
                                </span>
                            </OverlayTrigger>
                        </Form.Label>
                        <Col sm={9}>
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

                {/* Relations */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                        Relation Types
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip>
                                    List the allowed types of relations (edges) between nodes in the model. These types are critical for defining how relations are categorized and processed in the semantic translation. Ensure all required relation types are included
                                </Tooltip>
                            }
                        >
                            <span className="ms-2 text-info" style={{cursor: 'help'}}>
                                <BiHelpCircle />
                            </span>
                        </OverlayTrigger>
                    </Form.Label>
                    <Col sm={9}>
                        <CreatableSelect<SelectOption, true>
                            options={
                                Array.from(
                                    relationships.reduce((types, relationship) => {
                                        const typeProperty = relationship.properties?.find(
                                            (prop) => prop.name === "Type"
                                        );
                                        if (typeProperty?.possibleValues) {
                                            typeProperty.possibleValues.forEach((value) => types.add(value));
                                        }
                                        return types;
                                    }, new Set<string>())
                                ).map(type => ({
                                    value: type,
                                    label: type
                                }))
                            }
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
                        <Form.Label column sm={3}>
                            Relation Translation Rules
                            <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip>
                                    Define the translation rules for each relation type listed in 'relationTypes'. Specify 'params' for placeholders representing source and target nodes, and 'constraint' to express the logical condition for the relation in the target semantics. These rules enable precise semantic representation of relations.
                                </Tooltip>
                            }
                        >
                            <span className="ms-2 text-info" style={{cursor: 'help'}}>
                                <BiHelpCircle />
                            </span>
                        </OverlayTrigger>
                        </Form.Label>
                        <Col sm={9}>
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

                {/* Relation Property Schema */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                        Relation Property Schema
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip>
                                    Define the schema for relation properties. This schema specifies the type of the property and its key in the target semantics. The schema is essential for models with relations that include additional properties or variables.
                                </Tooltip>
                            }
                        >
                            <span className="ms-2 text-info" style={{cursor: 'help'}}>
                                <BiHelpCircle />
                            </span>
                        </OverlayTrigger>
                    </Form.Label>
                    <Col sm={9}>
                        <Button
                            variant="outline-primary"
                            onClick={() => handleOpenRelationPropertySchemaModal()}
                        >
                            {"Relation Property Schema"}
                        </Button>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                        Relation Reification Types
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip>
                                    Specifies the types of relations that are treated as reified relations in the model. Reified relations represent many-to-many, many-to-one, or one-to-many connections between elements and may include additional attributes or variables.
                                </Tooltip>
                            }
                        >
                            <span className="ms-2 text-info" style={{cursor: 'help'}}>
                                <BiHelpCircle />
                            </span>
                        </OverlayTrigger>
                    </Form.Label>
                    <Col sm={9}>
                        <div className="d-flex flex-wrap gap-2">
                            {elements.map(element => (
                                <Button
                                    key={element.name}
                                    variant={relationReificationTypes.includes(element.name) ? "primary" : "outline-primary"}
                                    onClick={() => {
                                        const currentSelection = [...relationReificationTypes];
                                        if (currentSelection.includes(element.name)) {
                                            const index = currentSelection.indexOf(element.name);
                                            currentSelection.splice(index, 1);
                                        } else {
                                            currentSelection.push(element.name);
                                        }
                                        onRelationReificationTypesChange(currentSelection);
                                    }}
                                >
                                    {element.name}
                                    {relationReificationTypes.includes(element.name) && (
                                        <span className="ms-1">✓</span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </Col>
                </Form.Group>

                {/* Attributes */}
                <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>
                    Attribute Types
                    <OverlayTrigger
                        placement="right"
                        overlay={
                            <Tooltip>
                                Specify the element types for which attributes will be translated. These types determine which properties of the elements are considered during semantic translation. Ensure this list includes all relevant element types that use attributes in the model.
                            </Tooltip>
                        }
                    >
                        <span className="ms-2 text-info" style={{cursor: 'help'}}>
                            <BiHelpCircle />
                        </span>
                    </OverlayTrigger>
                </Form.Label>
                <Col sm={9}>
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
                    <Form.Label column sm={3}>
                        Attribute Translation Rules
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip>
                                    Define how specific attributes are translated into logical constraints. Use 'parent' to refer to the associated element, 'param' to specify the field providing the value, and 'template' for the placeholder in the formula. The 'constraint' expresses the semantic rule using these placeholders. This is essential for models relying on attributes for contextual or operational semantics.
                                </Tooltip>
                            }
                        >
                            <span className="ms-2 text-info" style={{cursor: 'help'}}>
                                <BiHelpCircle />
                            </span>
                        </OverlayTrigger>    
                    </Form.Label>
                    <Col sm={9}>
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

                {/* Hierarchy */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>
                        Hierarchy Types
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip>
                                    Specify the types of elements that require translation based on their position in a hierarchical structure. These types often differ in semantics depending on whether they are at the root, intermediate nodes, or leaves in the hierarchy.
                                </Tooltip>
                            }
                        >
                            <span className="ms-2 text-info" style={{cursor: 'help'}}>
                                <BiHelpCircle />
                            </span>
                        </OverlayTrigger>
                    </Form.Label>
                    <Col sm={9}>
                        <div className="d-flex flex-wrap gap-2">
                            {elements.map(element => (
                                <Button
                                    key={element.name}
                                    variant={hierarchyTypes.includes(element.name) ? "primary" : "outline-primary"}
                                    onClick={() => {
                                        const currentSelection = [...hierarchyTypes];
                                        if (currentSelection.includes(element.name)) {
                                            const index = currentSelection.indexOf(element.name);
                                            currentSelection.splice(index, 1);
                                        } else {
                                            currentSelection.push(element.name);
                                        }
                                        onHierarchyTypesChange(currentSelection);
                                    }}
                                >
                                    {element.name}
                                    {hierarchyTypes.includes(element.name) && (
                                        <span className="ms-1">✓</span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </Col>
                </Form.Group>

                {hierarchyTypes.length > 0 && (
                <Form.Group as={Row} className="mb-3 align-items-center">
                    <Form.Label column sm={3}>
                        Hierarchy Translation Rules
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip>
                                    Define translation rules for hierarchical structures. Use 'nodeRule' to specify constraints for nodes with hierarchical connections, mapping their IDs and related nodes via 'paramMapping'. Use 'leafRule' for constraints when the element is a leaf node.
                                </Tooltip>
                            }
                        >
                            <span className="ms-2 text-info" style={{cursor: 'help'}}>
                                <BiHelpCircle />
                            </span>
                        </OverlayTrigger>
                    </Form.Label>
                    <Col sm={9}>
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

            {showRelationPropertySchemaModal && (
                <PropertySchemaModal
                    show={showRelationPropertySchemaModal}
                    schema={relationPropertySchema || { type: { index: 0, key: '' } }}
                    onSave={handleSaveRelationPropertySchema}
                    onClose={() => setShowRelationPropertySchemaModal(false)}
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