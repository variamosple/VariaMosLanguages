import { useState } from "react";
import { Button } from "react-bootstrap";
import { Paginator, PaginatorProps } from "@variamosple/variamos-components";
import { FC } from "react";
import { Alert, Table } from "react-bootstrap";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import { Trash, Share, CheckLg, XLg } from "react-bootstrap-icons";

import NoBackEndModal, {NoBackEndModalDefaultProps,NoBackEndModalProps} from "../NoBackEndModal";
export interface LanguagesProps extends PaginatorProps {
  state? : boolean;
  del? : boolean;
  share? : boolean;
  approve? : boolean;
  languages: Language[];
  onLanguageClick: (language: Language) => void;
  onLanguageDelete: (language: Language) => void
}

export const LanguagesList: FC<LanguagesProps> = ({
  state = false,
  del = false,
  share = false,
  approve = false,
  // onLanguageShare, // To be continued
  // onLanguageApproved, // To be continued 
  languages,
  onLanguageClick,
  onLanguageDelete,
  currentPage,
  onPageChange,
  totalPages,
}) => {
  /*To be delete in the end */
  const [noBackEndModalState, setNoBackEndModalState] = useState<NoBackEndModalProps>({...NoBackEndModalDefaultProps});
  const NoBackEndPopUp = () => {
      setNoBackEndModalState({
        ...NoBackEndModalDefaultProps,
        show: true,
        onCancel: () => setNoBackEndModalState((currentState) => ({...currentState, show: false})),
      });
    }
  /*--------------------------*/

  if (!languages?.length) {
    return <Alert variant="info">No results available</Alert>;
  }

  return (
    <div className="d-flex flex-column">
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      <Table bordered hover responsive="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            {state && <th>Status</th>}
            <th>Owner</th>
            {(del || approve || share) && <th className="center">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {languages.map((language, index) => (
            <tr
              key={index}
              className="cursor-pointer"
            >
              <td onClick={() => onLanguageClick(language)}>{language.name}</td>
              <td onClick={() => onLanguageClick(language)}>{language.type}</td>
              {state && (<td onClick={() => onLanguageClick(language)}>{language.stateAccept}</td>)}
              <td onClick={() => onLanguageClick(language)}>{language?.["ownerName"]}</td>
              <td className="text-center">
                <div className='d-flex gap-1 center'>
                  {approve && (language.stateAccept.toLowerCase()=="pending") && (<Button
                    className="btn-Variamos-green"
                    title="Approve Language"
                    onClick={NoBackEndPopUp}>
                      <CheckLg/>
                  </Button>)}
                  {approve && (language.stateAccept.toLowerCase()=="active") && (<Button
                    className="btn-Variamos-yellow"
                    title="Disapprove Language"
                    onClick={NoBackEndPopUp}>
                      <XLg/>
                  </Button>)}
                  {share && (<Button
                    className="btn-Variamos-green"
                    title="Share Language"
                    onClick={NoBackEndPopUp}>
                      <Share/>
                  </Button>)}
                  {del && (<Button
                    variant="danger"
                    onClick={NoBackEndPopUp}
                    title="Delete language"
                  >
                    <Trash />
                  </Button>)}                  
                </div>
              </td>
            </tr>)
          )}
        </tbody>
      </Table>
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    {/* To be delete*/}
    <NoBackEndModal {...noBackEndModalState} />
    </div>
  );
};
