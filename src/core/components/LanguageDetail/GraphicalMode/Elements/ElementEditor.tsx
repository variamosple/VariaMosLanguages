import ItemListWithForm from "../Utils/ItemListWithForm";
import PropertyForm from "../Utils/PropertyForm";
import ElementForm from "./ElementForm";

export default function ElementEditor({selectedElement, handleChange}) {
    const defaultNewProperty = {
        name: `Property ${selectedElement.properties.length + 1}`,
        type: "",
        possibleValues: [],
        linked_property: "",
        linked_value: "",
      };

    const handleUpdateProperties = (newProperties) => {
        handleChange({
          target: {
            name: 'properties',
            value: newProperties
          }
        });
    }

    return (
        <div>
            <ElementForm
            selectedElement={selectedElement}
            handleChange={handleChange}/>
            <ItemListWithForm
            items={selectedElement.properties}
            setItems={handleUpdateProperties}
            defaultNewItem={defaultNewProperty}
            itemLabel={"property"}
            FormComponent={PropertyForm}/>
        </div>
    )
}