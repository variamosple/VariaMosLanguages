import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import VariaMosLogo from "../../../Addons/images/VariaMosLogo.png";
import {
  getDataBaseUserProfile,
  logoutUser,
} from "../../../UI/SignUp/SignUp.utils";
import { REPOSITORY_URL } from "../../constants/constants";

const CREATE_LANGUAGES_PERMISSION_ID = 1;
const CREATE_PRODUCT_LINES_PERMISSION_ID = 3;

function Layout({ children }) {
  const [profile, setProfile] = useState<{
    user: { id: string; name: string };
    permissions: { id: number; name: string }[];
  }>(null);

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
          <Navbar.Brand href="/dashboard">
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
              <Nav.Link href="/languages">Languages</Nav.Link>
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
        {/* <div className="row">
          <div className="col-md-3">
            <h3>Help</h3>
            <div><a href="#">Link 1</a></div>
            <div><a href="#">Link 2</a></div>
            <div><a href="#">Link 3</a></div>
            <div><a href="#">Link 4</a></div>
            <div><a href="#">Link 5</a></div>
          </div>
          <div className="col-md-3">
            <h3>Help</h3>
            <div><a href="#">Link 1</a></div>
            <div><a href="#">Link 2</a></div>
            <div><a href="#">Link 3</a></div>
            <div><a href="#">Link 4</a></div>
            <div><a href="#">Link 5</a></div>
          </div>
          <div className="col-md-3">
            <h3>Help</h3>
            <div><a href="#">Link 1</a></div>
            <div><a href="#">Link 2</a></div>
            <div><a href="#">Link 3</a></div>
            <div><a href="#">Link 4</a></div>
            <div><a href="#">Link 5</a></div>
          </div>
          <div className="col-md-3">
            <h3>Help</h3>
            <div><a href="#">Link 1</a></div>
            <div><a href="#">Link 2</a></div>
            <div><a href="#">Link 3</a></div>
            <div><a href="#">Link 4</a></div>
            <div><a href="#">Link 5</a></div>
          </div>
        </div> */}
        <div className="row g-0 copyright">
          {" "}
          {/* no gutters to avoid horizontal scroll*/}
          <p>© Copyright 2023 VariaMos.</p>
        </div>
      </footer>
    </>
  );
}

export default Layout;
