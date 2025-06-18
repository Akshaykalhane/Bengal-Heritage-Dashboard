import Login from "./components/login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import ServerOne from "./pages/server-one/ServerOne";
import ServerTwo from "./pages/server-two/ServerTwo";
import ServerThree from "./pages/server-three/ServerThree";
import ServerFour from "./pages/server-four/ServerFour";

function App() {
  return (
    <div className="Main-Admin-Container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ServerOne />} />
          <Route path="/server-two" element={<ServerTwo />} />
          <Route path="/server-three" element={<ServerThree />} />
          <Route path="/server-four" element={<ServerFour />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
