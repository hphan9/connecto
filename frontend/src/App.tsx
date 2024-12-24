import "./App.css";
import Sidebar from "./components/common/Sidebar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignupPage";
import RightPanel from "./components/common/RightPanel";

// todo: move routes to seperate file
function App() {
  return (
    <div className="flex max-w-6x1 mx-auto">
      {/*Common component*/}
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
      <RightPanel />
    </div>
  );
}

export default App;
