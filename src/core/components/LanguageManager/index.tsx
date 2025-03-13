import { useSession } from "@variamosple/variamos-components";
import { useEffect, useState } from "react";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import { PublicLanguagesContainer } from "../PublicLanguages/PublicLanguagesContainer";
import { UserLanguagesContainer } from "../UserLanguages/UserLangugesContainer";
import CreateLanguageButton from "./CreateLanguageButton/CreateLanguageButton";
import LanguageManagerLayout from "./LanguageManagerLayout/LanguageManagerLayout";
import { LanguageManagerProps } from "./index.types";

export default function LanguageManager({
  setLanguage,
  setCreatingLanguage,
  setEditLanguage,
}: LanguageManagerProps) {
  const { user } = useSession();
  const [isGuestUser, setIsGuestUser] = useState(true);
  const [loadPublicLanguages, setLoadPublicLanguages] = useState(false);

  useEffect(() => {
    const isGuest = user.roles.find((role) => role.toLowerCase() === "guest");

    setIsGuestUser(!!isGuest);
    setLoadPublicLanguages(!!isGuest);
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
          </Col>
        </Col>

        <PublicLanguagesContainer
          loadDataOnInit={loadPublicLanguages}
          onLanguageClick={handleClick}
        />
      </LanguageManagerLayout>
    );
  }

  return (
    <LanguageManagerLayout>
      <Col as={Row}>
        <Col sm={6}>
          <CreateLanguageButton handleCreateClick={handleCreateClick} />
        </Col>
      </Col>

      <Tabs
        defaultActiveKey="userLanguages"
        id="uncontrolled-tab"
        onSelect={(eventKey) => {
          if (eventKey === "publicLanguages") {
            setLoadPublicLanguages(true);
          }
        }}
      >
        <Tab
          eventKey="userLanguages"
          title="My Languages"
          className="pt-3"
          unmountOnExit
        >
          <UserLanguagesContainer onLanguageClick={handleClick} />
        </Tab>

        <Tab
          eventKey="publicLanguages"
          title="Public Languages"
          className="pt-3"
          unmountOnExit
        >
          <PublicLanguagesContainer
            loadDataOnInit={loadPublicLanguages}
            onLanguageClick={handleClick}
          />
        </Tab>
      </Tabs>
    </LanguageManagerLayout>
  );
}
