function removeNullKeys(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    const value = removeNullKeys(obj[key]);
    // if value is null, undefined, empty string, empty list or empty object
    if (value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0) && !(typeof value === 'object' && Object.keys(value).length === 0)) {
      result[key] = value;
    }
  }
  return result;
}


export function graphicalToTextual(elements, relationships, restrictions) {
  // Compiling concreteSyntax
  const concreteSyntaxJson = JSON.stringify(
    {
      elements: elements.reduce((acc, element) => {
        acc[element.name] = {
          draw: element.draw,
          icon: element.icon,
          label: element.label,
          width: element.width,
          height: element.height,
        };
        return acc;
      }, {}),
      relationships: relationships.reduce((acc, relationship) => {
        const { name, styles, labels } = relationship;
        acc[name] = {
          styles,
          labels,
        };
          
        return acc;
      }, {}),
    },
    null,
    2 // Use 2 spaces for indentation
  );

  // Compiling abstractSyntax
  const abstractSyntaxJson = JSON.stringify(
    {
      elements: elements.reduce((acc, element) => {
        acc[element.name] = removeNullKeys({
          properties: (element.properties || []).map((property) => ({
            ...property,
            possible_values: property.possible_values.join(','), // Concaténer les valeurs possibles
          })),
        });
        return acc;
      }, {}),
      relationships: relationships.reduce((acc, relationship) => {
        const { name, styles, labels, ...rest } = relationship;
        acc[name] = removeNullKeys({
          styles,
          labels,
          ...rest,
        });
        return acc;
      }, {}),
      restrictions: removeNullKeys({
        unique_name: removeNullKeys(restrictions.unique_name),
        parent_child: removeNullKeys(restrictions.parent_child),
        quantity_element: removeNullKeys(restrictions.quantity_element),
      }),
    },
    null,
    2 // Use 2 spaces for indentation
  );

  return {
    concreteSyntax: concreteSyntaxJson,
    abstractSyntax: abstractSyntaxJson,
  };
}



export function textualToGraphical(abstractSyntaxJson, concreteSyntaxJson) {
  const abstractSyntax = JSON.parse(abstractSyntaxJson);
  const concreteSyntax = JSON.parse(concreteSyntaxJson);

  // Parse elements from concreteSyntax and abstract syntax
  const concreteElements = concreteSyntax.elements || {};
  const elements = Object.keys(concreteElements).map((name) => ({
    name,
    ...concreteElements[name],
  }));

  elements.forEach((element) => {
    const properties = abstractSyntax.elements?.[element.name]?.properties || [];
    element.properties = properties.map((property) => ({
      ...property,
      possible_values: property.possible_values ? property.possible_values.split(",") : [],
    }));
  });
  
  // Parse relationships from abstractSyntax
  const abstractRelationships = abstractSyntax.relationships || {};
  const relationships = Object.keys(abstractRelationships).map((name) => {
    const relationship = {
      name,
      ...abstractRelationships[name],
    };
    if (relationship.possible_values) {
      relationship.possible_values = relationship.possible_values.split(",");
    }
    return relationship;
  });
  
  // Parse restrictions from abstractSyntax
  const restrictions = {
    "unique_name": { elements: [[]] },
    "parent_child": [],
    "quantity_element": [],
  };

  if (abstractSyntax.restrictions) {
    if (abstractSyntax.restrictions.unique_name) {
      restrictions.unique_name = abstractSyntax.restrictions.unique_name;
    }
    if (Array.isArray(abstractSyntax.restrictions.parent_child)) {
      restrictions.parent_child = abstractSyntax.restrictions.parent_child;
    }
    if (Array.isArray(abstractSyntax.restrictions.quantity_element)) {
      restrictions.quantity_element = abstractSyntax.restrictions.quantity_element;
    }
  }

  // Parse styles and labels for relationships from concreteSyntax
  relationships.forEach((relationship) => {
    const concreteRelationship = concreteSyntax.relationships?.[relationship.name] || {};
    relationship.styles = concreteRelationship.styles || [];
    relationship.labels = concreteRelationship.labels || [];
  });

  return { elements, relationships, restrictions };
}
