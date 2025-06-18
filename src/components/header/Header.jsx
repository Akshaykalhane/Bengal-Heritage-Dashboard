import React, { useEffect, useState } from "react";
import { Navbar, Container, Form } from "react-bootstrap";
import sunriseLogo from "../../assets/sunrise-logo.png";
import bengal_heritage_logo from "../../assets/bong-logo.png";
import { FiLogOut } from "react-icons/fi";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  // Get server from path on load
  const currentPath = location.pathname.replace("/", "") || "server-one";
  const [selectedServer, setSelectedServer] = useState(currentPath);

  useEffect(() => {
    setSelectedServer(currentPath);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("user logged out successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleServerChange = (e) => {
    const newServer = e.target.value;
    setSelectedServer(newServer);
    if (newServer === "server-one") {
      navigate(`/`);
    } else {
      navigate(`/${newServer}`);
    }
  };

  return (
    <Navbar expand="lg" bg="light" variant="light" className="shadow-sm">
      <Container
        fluid
        className="ps-xl-5 d-flex justify-content-between align-items-center"
      >
        <div className="d-flex align-items-center gap-2">
          <img src={sunriseLogo} alt="Logo 1" height="50" className="me-2" />
          <img src={bengal_heritage_logo} alt="Logo 2" height="50" />
        </div>

        {user && (
          <div className="d-flex align-items-center gap-3 me-3">
            <Form.Select
              size="sm"
              value={selectedServer}
              onChange={handleServerChange}
              style={{ width: "150px" }}
            >
              <option value="server-one">Server 1</option>
              {/* <option value="server-two">Server 2</option>
              <option value="server-three">Server 3</option>
              <option value="server-four">Server 4</option> */}
            </Form.Select>

            <FiLogOut
              size={20}
              className="text-danger"
              style={{ cursor: "pointer" }}
              title="Logout"
              onClick={handleLogout}
            />
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
