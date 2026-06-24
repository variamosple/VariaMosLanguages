import { useSession } from "@variamosple/variamos-components";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Paginator, PaginatorProps } from "@variamosple/variamos-components";
import { FC } from "react";
import { Alert, Table } from "react-bootstrap";
import { Language } from "../../../Domain/ProductLineEngineering/Entities/Language";
import { Trash, Share, CheckLg, XLg, ArrowClockwise } from "react-bootstrap-icons";

export interface LanguagesProps extends PaginatorProps {
  state? : boolean;
  del? : boolean;
  share? : boolean;
  approve? : boolean;
  languages: Language[];
  onLanguageClick: (language: Language) => void;
  onLanguageDelete: (language: Language) => void;
  onLanguageUpdateStateAccept: (language : Language, stateAccept: string) => void;
}

export const LanguagesList: FC<LanguagesProps> = ({
  state = false,
  del = false,
  share = false,
  approve = false,
  // onLanguageShare, // To be continued
  onLanguageUpdateStateAccept, // To be continued 
  languages,
  onLanguageClick,
  onLanguageDelete,
  currentPage,
  onPageChange,
  totalPages,
}) => {
  
  const { user } = useSession();
  const [isLanguageDirector, setIsLanguageDirector] = useState(false);
  
  useEffect(() => {
    setIsLanguageDirector(!!(user.roles.find((role) => role.toLowerCase() === "language director")));
  }, [user]);

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
            {approve && <th>Id</th>}
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
              {approve && (<td 
              onClick={() => onLanguageClick(language)}>{language.id}</td>)}
              <td 
              onClick={() => onLanguageClick(language)}>{language.name}</td>
              <td 
              onClick={() => onLanguageClick(language)}>{language.type}</td>
              {state && (<td onClick={() => onLanguageClick(language)}>{language.stateAccept}</td>)}
              <td onClick={() => onLanguageClick(language)}>{language?.["ownerName"]}</td>
              {(del || approve || share) && (<td className="text-center">
                <div className='d-flex gap-1 center'>
                  {approve && (language?.stateAccept?.toLowerCase()=="pending") && (<Button
                    className="btn-Variamos-green"
                    title="Approve Language"
                    onClick={() => ( onLanguageUpdateStateAccept(language, "ACTIVE"))}>
                      <CheckLg/>
                  </Button>)}
                  {approve && (language?.stateAccept?.toLowerCase()=="active") && (<Button
                    className="btn-Variamos-yellow"
                    title="Disapprove Language"
                    onClick={() => ( onLanguageUpdateStateAccept(language, "PENDING"))}>
                      <XLg/>
                  </Button>)}
                  {share && language?.accessLevel?.toLowerCase() == "owner" && (<Button
                    className="btn-Variamos-green"
                    title="Share Language">
                      <Share/>
                  </Button>)}
                  { language?.stateAccept?.toLowerCase() !=="deleted" &&(((del && language?.accessLevel?.toLowerCase() == "owner") || isLanguageDirector)) && (<Button
                    variant="danger"
                    onClick={() => onLanguageDelete(language)}
                    title="Delete language"
                  >
                    <Trash />
                  </Button>)}
                  {language?.stateAccept?.toLowerCase() =="deleted" && isLanguageDirector && (<Button
                  variant="secondary">
                    <ArrowClockwise/>
                  </Button>)}                  
                </div>
              </td>)}
            </tr>)
          )}
        </tbody>
      </Table>
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
