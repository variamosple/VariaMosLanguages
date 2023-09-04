import { useState, useCallback, useEffect } from "react";
import { useItemEditorContext } from "../../../../../../context/LanguageContext/ItemEditorContextProvider";
import ItemList from "../ItemList/ItemList";
import ItemEditor from "./ItemEditor";
import StyleForm from "../../../Relationships/Styles/StyleForm";

export default function ItemStyles() {
    const {formValues, setFormValues, } = useItemEditorContext();
    const styles=formValues.styles;
    const properties=formValues.properties;
    const setStyles = (newStyles) => {
        setFormValues((prev) => ({
          ...prev,
          styles: newStyles,
        }));
      };

    const [selectedStyle, setSelectedStyle] = useState({});
    const [showEditor, setShowEditor] = useState(false);
  
    const handleOpenCloseEditor = useCallback(() => {
      if (Object.keys(selectedStyle).length !== 0) {
        setShowEditor(true);
      }
      else { setShowEditor(false)}
    }, [selectedStyle]);
  
    useEffect(() => handleOpenCloseEditor(),[selectedStyle, handleOpenCloseEditor])

    const newStyle = {
        style: "",
        linked_property:"",
        linked_value:""
      };


    return(
      <div >
        <h2 className="section-list-title">Styles</h2>
        <hr className="form-separation" />
        <ItemList
        items={styles}
        setItems={setStyles}
        defaultNewItem={newStyle}
        itemLabel={"style"}
        setSelectedItem={setSelectedStyle}
        />

        {showEditor &&
          <div>
            <h2 className="section-list-title">Styles</h2>
            <hr className="form-separation" />
            <ItemEditor
            items={styles}
            setItems={setStyles}
            selectedItem={selectedStyle}
            setSelectedItem={setSelectedStyle}>
              <StyleForm show={showEditor} properties={properties}/>
            </ItemEditor>
          </div>
        }
      </div>
    )
}