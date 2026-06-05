import { useSession } from "@variamosple/variamos-components";
import { useEffect, useState } from "react";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import { LanguagesContainer } from "../LanguageTable/LanguagesContainer";
import CreateLanguageButton from "./CreateLanguageButton/CreateLanguageButton";
import LanguageManagerLayout from "./LanguageManagerLayout/LanguageManagerLayout";
import { LanguageManagerProps } from "./index.types";
import {Button} from "react-bootstrap";
import NoBackEndModal, {NoBackEndModalDefaultProps,NoBackEndModalProps} from "../NoBackEndModal";

export default function LanguageManager({
  setLanguage,
  setCreatingLanguage,
  setEditLanguage,
}: LanguageManagerProps) {
  const { user } = useSession();
  const [isGuestUser, setIsGuestUser] = useState(true);
  const [isLanguageDirectorUser, setIsLanguageDirectorUser] = useState(false);
  const [loadLanguages, setLoadLanguages] = useState(false);
  const [loadUserLanguages, setLoadUserLanguages] = useState(true);
  const [loadPublicLanguages, setLoadPublicLanguages] = useState(false);

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

  useEffect(() => {
    const isGuest = user.roles.find((role) => role.toLowerCase() === "guest");
    const isLanguageDirector = user.roles.find((role) => role.toLowerCase() === "language director");
    console.log("User roles: ",user.roles, "\nUser id : ", user.id)
    setIsGuestUser(!!isGuest);
    setIsLanguageDirectorUser(!!isLanguageDirector);
    setLoadLanguages(!!isGuest);
  }, [user]);

  const handleCreateClick = () => {
    setCreatingLanguage(true);
    setEditLanguage(true);
  };

  const handleClick = (language) => {
    setLanguage(language);
    setCreatingLanguage(false);
    setEditLanguage(true);
  };

  if (isGuestUser) {
    return (
      <LanguageManagerLayout>
        <Col as={Row}>
          <Col sm={6}>
            <CreateLanguageButton handleCreateClick={handleCreateClick} />
            <button
            >Sementic Rules</button>
          </Col>
        </Col>

        <LanguagesContainer
          variant = "public"
          loadDataOnInit={loadPublicLanguages}
          onLanguageClick={handleClick}
        />
      </LanguageManagerLayout>
    );
  }

  return (
    <LanguageManagerLayout>

      <div className='d-flex gap-1'>
        <CreateLanguageButton handleCreateClick={handleCreateClick} />
        
        <Button 
          variant="secondary"
          onClick={NoBackEndPopUp}>
          Sementic Rules
        </Button>
      </div>

      <Tabs
        defaultActiveKey="userLanguages"
        id="uncontrolled-tab"
        onSelect={
          (eventKey)=> {
            switch (eventKey) {
              case ("userLanguages"):
                setLoadUserLanguages(true);
                break;
              case "publicLanguages":
                setLoadPublicLanguages(true);
                break;
              case "allLanguages":
                setLoadLanguages(true);
                break;}
              }}
      >
        <Tab
          eventKey="userLanguages"
          title="My Languages"
          className="pt-3"
          unmountOnExit
        >
          <LanguagesContainer
            variant = "user"
            loadDataOnInit={loadUserLanguages}
            onLanguageClick={handleClick}
          />
        </Tab>

        <Tab
          eventKey="publicLanguages"
          title="Public Languages"
          className="pt-3"
          unmountOnExit
        >
          <LanguagesContainer
            variant = "public"
            loadDataOnInit={loadPublicLanguages}
            onLanguageClick={handleClick}
          />
        </Tab>
        { isLanguageDirectorUser && (<Tab 
          eventKey="allLanguages"
          title="All Languages"
          className="pt-3"
          unmountOnExit
          >
            <LanguagesContainer
            variant = "languageDirector"
            loadDataOnInit={loadLanguages}
            onLanguageClick={handleClick}
            />
        </Tab>)}
      </Tabs>
    {/* To be deleted in the end */}
    <NoBackEndModal {...noBackEndModalState} />
    </LanguageManagerLayout>
  );
}
