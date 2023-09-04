import { useState, useCallback, useEffect } from "react";
import { useItemEditorContext } from "../../../../../../context/LanguageContext/ItemEditorContextProvider";
import ItemList from "../ItemList/ItemList";
import ItemEditor from "./ItemEditor";
import LabelForm from "../../../Relationships/Labels/LabelForm";

export default function ItemLabels() {
    const {formValues, setFormValues, } = useItemEditorContext();
    const labels=formValues.labels;
    const properties=formValues.properties;
    const setLabels = (newLabels) => {
        setFormValues((prev) => ({
          ...prev,
          labels: newLabels,
        }));
      };

    const [selectedLabel, setSelectedLabel] = useState({});
    const [showEditor, setShowEditor] = useState(false);
  
    const handleOpenCloseEditor = useCallback(() => {
      if (Object.keys(selectedLabel).length !== 0) {
        setShowEditor(true);
      }
      else { setShowEditor(false)}
    }, [selectedLabel]);
  
    useEffect(() => handleOpenCloseEditor(),[selectedLabel, handleOpenCloseEditor])

    const newLabel = {
        align: "",
        style:"",
        offset_x:"",
        offset_y:"",
        label_property:[],
        label_separator:""
      }


    return(
      <div >
        <h2 className="section-list-title">Labels</h2>
        <hr className="form-separation" />
        <ItemList
        items={labels}
        setItems={setLabels}
        defaultNewItem={newLabel}
        itemLabel={"label"}
        setSelectedItem={setSelectedLabel}
        />

        {showEditor &&
          <div>
            <h2 className="section-list-title">Labels</h2>
            <hr className="form-separation" />
            <ItemEditor
            items={labels}
            setItems={setLabels}
            selectedItem={selectedLabel}
            setSelectedItem={setSelectedLabel}>
              <LabelForm show={showEditor} properties={properties}/>
            </ItemEditor>
          </div>
        }
      </div>
    )
}