import ItemListModal from "../RestrictionList";
import UniqueNameForm from "./UniqueNameForm";

export default function UniqueNameList({ show, handleClose }) {
    return (
        <ItemListModal
          show={show}
          handleClose={handleClose}
          title="Unique name restrictions"
          restrictionType="unique_name"
          FormComponent={UniqueNameForm}
          newItemTemplate={{
            elements: [[]],
          }}
        />
      );
    }