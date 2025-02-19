import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/config/ProtectedRoute";
import Template from "./components/layout/Template";
import Console from "./components/layout/console";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLogin") === "true");
  return (
    <Routes>
      <Route path="/app/*" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Template />
          </ProtectedRoute>
        }
      />
      <Route path="/wa/console/:sessionId" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Console />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Auth setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
