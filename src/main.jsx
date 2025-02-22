import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import ChallengesPage from "./pages/ChallengesPage";
import ProblemPage from "./pages/ProblemPage";
import ProfilePage from "./pages/ProfilePage";

import SignInPage from "./pages/SignInPage"; // ✅ Ensure this file exists

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/solve/:id" element={<ProblemPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
          <Route path="/signin" element={<SignInPage />} /> {/* ✅ Ensure this exists */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
