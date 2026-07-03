import { Routes, Route } from "react-router-dom";

// Pages (adjust paths to your project)
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 404 fallback (VERY IMPORTANT) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;