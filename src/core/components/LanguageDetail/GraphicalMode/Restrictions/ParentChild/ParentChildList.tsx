import ItemListModal from "../RestrictionList";
import ParentChildForm from "./ParentChildForm";

export default function ParentChildList({ show, handleClose}) {
  return (
    <ItemListModal
      show={show}
      handleClose={handleClose}
      title="Parent Child restrictions"
      restrictionType="parent_child"
      FormComponent={ParentChildForm}
      newItemTemplate={{
        childElement: "",
        parentElement: [],
      }}
    />
  );
}