import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Singup from "./components/Singup";
import LayoutWrapper from "./components/LayoutWrapper";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutWrapper />}>
          <Route path="signup" element={<Singup />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
