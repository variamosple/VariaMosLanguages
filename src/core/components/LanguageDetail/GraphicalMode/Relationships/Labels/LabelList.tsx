import {useEffect, useState } from "react";
import ItemList from "../../Utils/ItemList";
import LabelForm from "./LabelForm";

export default function LabelList({labels, setLabels, properties}) {
    const [selectedLabel, setSelectedLabel] = useState({});
    const [showLabelForm, setShowLabelForm] = useState(false);
    const newLabel = {
        align: "",
        style:"",
        offset_x:"",
        offset_y:"",
        label_property:[],
        label_separator:""
      }

    useEffect(() => {
      if(Object.keys(selectedLabel).length !== 0) {
        setShowLabelForm(true)
      }
    }, [selectedLabel])

    const handleClose = () => {
        setSelectedLabel({});
        setShowLabelForm(false);
    }
  
    return (
      <div >
        <h2 className="section-list-title">Labels</h2>
        <hr className="form-separation" />
  
        <ItemList
          items={labels}
          setItems={setLabels}
          newItem={newLabel}
          label={"label"}
          setSelectedItem={setSelectedLabel}/>    

        <LabelForm
                show={showLabelForm}
                handleClose={handleClose}
                selectedLabel={selectedLabel}
                setSelectedLabel={setSelectedLabel}
                labels={labels}
                setLabels={setLabels} 
                properties={properties}/>
      </div>
    );
  }
  