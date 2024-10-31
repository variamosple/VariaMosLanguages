import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import VariaMosLogo from "../../../Addons/images/VariaMosLogo.png";
import {
  getDataBaseUserProfile,
  logoutUser,
} from "../../../UI/SignUp/SignUp.utils";
import { REPOSITORY_URL } from "../../constants/constants";
import { CREATE_LANGUAGES_PERMISSION_ID, CREATE_PRODUCT_LINES_PERMISSION_ID } from "./Layout.constants";
import { UserProfileProps } from "./Layout.types";

function Layout({ children }) {
  const [profile, setProfile] = useState<UserProfileProps>(null);

  useEffect(() => {
    const userProfile = getDataBaseUserProfile();
    setProfile(userProfile);
  }, []);

  const handleLogout = () => {
    logoutUser();
  };

  const handleReportProblem = () => {
    window.open(`${REPOSITORY_URL}issues/new`, `blank`);
  };

  const handleOpenIssues = () => {
    window.open(`${REPOSITORY_URL}issues/`, `blank`);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              src={VariaMosLogo}
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="https://variamos.com/home/" target="_blank">
                Home
              </Nav.Link>
              <Nav.Link
                href="https://github.com/variamosple/VariaMosPLE/wiki"
                target="_blank"
              >
                Wiki
              </Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown
                title={profile?.user.name || 'Guest'}
                className="me-5 pe-5"
                id="nav-dropdown"
              >
                {/* TODO: Add a Profile page */}
                <NavDropdown.Item onClick={handleReportProblem}>
                  Report a problem
                </NavDropdown.Item>
                {(profile?.permissions
                  .map((permission) => permission.id)
                  .includes(CREATE_LANGUAGES_PERMISSION_ID) ||
                  profile?.permissions
                    .map((permission) => permission.id)
                    .includes(CREATE_PRODUCT_LINES_PERMISSION_ID)) && (
                  <NavDropdown.Item onClick={handleOpenIssues}>
                    Issues
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item eventKey="4.3" onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="bodyContent">{children}</div>
      <footer>
        <div className="row copyright">
          <p>© Copyright 2023 VariaMos. Versión 4.24.10.31.07</p>
        </div>
      </footer>
    </>
  );
}

export default Layout;
