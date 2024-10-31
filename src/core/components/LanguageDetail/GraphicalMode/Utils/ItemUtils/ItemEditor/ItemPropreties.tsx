import { useState, useCallback, useEffect } from "react";
import { useItemEditorContext } from "../../../../../../context/LanguageContext/ItemEditorContextProvider";
import ItemList from "../ItemList/ItemList";
import PropertyForm from "../../PropertyForm";
import ItemEditor from "./ItemEditor";

export default function ItemProperties() {
  const { formValues, setFormValues } = useItemEditorContext();
  const properties = formValues.properties ?? [];
  const setProperties = (newProperties) => {
    setFormValues((prev) => ({
      ...prev,
      properties: newProperties,
    }));
  };

  const [selectedProperty, setSelectedProperty] = useState({});
  const [showEditor, setShowEditor] = useState(false);

  const handleOpenCloseEditor = useCallback(() => {
    if (Object.keys(selectedProperty).length !== 0) {
      setShowEditor(true);
    } else {
      setShowEditor(false);
    }
  }, [selectedProperty]);

  useEffect(
    () => handleOpenCloseEditor(),
    [selectedProperty, handleOpenCloseEditor]
  );

  const newProperty = {
    name: `Property_${properties.length + 1}`,
    type: "String",
    possibleValues: [],
    linked_property: "",
    linked_value: "",
  };

  return (
    <div>
      <h2 className="section-list-title">Properties</h2>
      <hr className="form-separation" />
      <ItemList
        items={properties}
        setItems={setProperties}
        defaultNewItem={newProperty}
        itemLabel={"property"}
        setSelectedItem={setSelectedProperty}
      />

      {showEditor && (
        <div>
          <ItemEditor
            items={properties}
            setItems={setProperties}
            selectedItem={selectedProperty}
            setSelectedItem={setSelectedProperty}
          >
            <PropertyForm show={showEditor} />
          </ItemEditor>
        </div>
      )}
    </div>
  );
}
