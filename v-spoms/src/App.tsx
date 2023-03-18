import { Route, Routes, BrowserRouter } from "react-router-dom";
import Action from "./pages/Action";
import Credits from "./pages/Credits";
import Docs from "./pages/Docs";
import FAQ from "./pages/FAQ";
import Home from "./pages/Home";
import Introduction from "./pages/Introduction";
import NavBar from "./pages/Navbar";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intro" element={<Introduction />} />
        <Route path="/action" element={<Action />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/faq" element={<FAQ />} />∏
      </Routes>
    </BrowserRouter>
  );
}

export default App;
