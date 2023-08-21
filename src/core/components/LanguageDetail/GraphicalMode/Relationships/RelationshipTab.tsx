import { useContext, useState } from "react";
import ItemList from "../Utils/ItemList";
import RelationshipForm from "./RelationshipForm";
import { LanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";

export default function RelationshipTab() {
  const { relationships, setRelationships} = useContext(LanguageContext);
  const [selectedRelationship, setSelectedRelationship] = useState({});

  const handleAddRelationship = () => {
    const newRelationship = {
      name: `Relationship ${relationships.length + 1}`,
      min: "",
      max: "",
      source: "",
      target: [],
      properties: [],
      styles:[],
      labels:[]
    };
    setRelationships([...relationships, newRelationship]);
  };

  const handleUpdateRelationships = (updatedRelationship) => {
    const index = relationships.findIndex((relationship) => relationship.name === updatedRelationship.name);

    if (index !== -1) {
      const updatedRelationships = [...relationships];
      updatedRelationships[index] = updatedRelationship;
      setRelationships(updatedRelationships);
    }
  };

  return (
    <div>
      <ItemList
        items={relationships}
        setItems={setRelationships}
        onAdd={handleAddRelationship}
        label="relationship"
        selectedItem={selectedRelationship}
        setSelectedItem={setSelectedRelationship}
        renderModal={({ show, onClose }) => (
            <RelationshipForm
              show={show}
              handleClose={onClose}
              selectedRelationship={selectedRelationship}
              handleUpdateRelationships={handleUpdateRelationships}/>
        )}
      />
    </div>
  );
}
