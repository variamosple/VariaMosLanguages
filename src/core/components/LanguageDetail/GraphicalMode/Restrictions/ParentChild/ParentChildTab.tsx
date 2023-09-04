import { useCallback, useEffect, useState } from "react";
import { useLanguageContext } from "../../../../../context/LanguageContext/LanguageContextProvider";
import ItemEditor from "../../Utils/ItemUtils/ItemEditor/ItemEditor";
import ItemList from "../../Utils/ItemUtils/ItemList/ItemList";
import ParentChildForm from "./ParentChildForm";

export default function ParentChildTab() {
  const { restrictions, setRestrictions } = useLanguageContext();
  const parentChildRestrictions = restrictions.parent_child;
  const setParentChildRestrictions = (newParentChildRestrictions) => {
    setRestrictions((prev) => ({
      ...prev,
      parent_child: newParentChildRestrictions,
    }));
  }; 
  const defaultNewParentChild = {
    childElement: "",
    parentElement: [],
  };
  
    const [selectedElement, setSelectedElement] = useState({});
    const [showEditor, setShowEditor] = useState(false);
  
    const handleOpenCloseEditor = useCallback(() => {
    if (Object.keys(selectedElement).length !== 0) {
      setShowEditor(true);
    }
    else { setShowEditor(false)}
  }, [selectedElement]);
  
    useEffect(() => handleOpenCloseEditor(),[selectedElement, handleOpenCloseEditor])  
  
    return (
      <div>
        {(showEditor)? (
        <ItemEditor
        items={parentChildRestrictions}
        setItems={setParentChildRestrictions}
        selectedItem={selectedElement}
        setSelectedItem={setSelectedElement}>
          <ParentChildForm show={showEditor}/>
        </ItemEditor>
            
        ) : (
          <ItemList
          items={parentChildRestrictions}
          setItems={setParentChildRestrictions}
          defaultNewItem={defaultNewParentChild}
          itemLabel={"parent child"}
          setSelectedItem={setSelectedElement}
          />
        )}
      </div>
    );
  }