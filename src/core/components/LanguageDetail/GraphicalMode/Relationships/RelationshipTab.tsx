import RelationshipForm from "./RelationshipForm";
import { useLanguageContext } from "../../../../context/LanguageContext/LanguageContextProvider";
import ItemEditor from "../Utils/ItemUtils/ItemEditor/ItemEditor";
import { useState, useCallback, useEffect } from "react";
import ItemList from "../Utils/ItemUtils/ItemList/ItemList";

export default function ElementTab() {
  const { relationships, setRelationships } = useLanguageContext();
  const defaultNewRelationship = {
    name: `Relationship ${relationships.length + 1}`,
    min: "",
    max: "",
    source: "",
    target: "",
    label_property: "",
    properties: [],
    labels : [],
    styles:[]
  };
  
    const [selectedRelationship, setSelectedRelationship] = useState({});
    const [showEditor, setShowEditor] = useState(false);
  
    const handleOpenCloseEditor = useCallback(() => {
    if (Object.keys(selectedRelationship).length !== 0) {
      setShowEditor(true);
    }
    else { setShowEditor(false)}
  }, [selectedRelationship]);
  
    useEffect(() => handleOpenCloseEditor(),[selectedRelationship, handleOpenCloseEditor])
  
  
  
    return (
      <div>
        {(showEditor)? (
        <ItemEditor
        items={relationships}
        setItems={setRelationships}
        selectedItem={selectedRelationship}
        setSelectedItem={setSelectedRelationship}>
          <RelationshipForm/>
          <ItemEditor.Properties/>
          <ItemEditor.Labels/>
          <ItemEditor.Styles/>
          <ItemEditor.SaveButton/>
        </ItemEditor>
            
        ) : (
          <ItemList
          items={relationships}
          setItems={setRelationships}
          defaultNewItem={defaultNewRelationship}
          itemLabel={"relationship"}
          setSelectedItem={setSelectedRelationship}
          />
        )}
      </div>
    );
  }