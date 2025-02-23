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
    <BrowserRouter basename="/">
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<ChallengesPage />} /> {/* ✅ Default route */}
      <Route path="solve/:id" element={<ProblemPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>
    <Route path="signin" element={<SignInPage />} /> {/* ✅ No extra "/" */}
    <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* ✅ Catch-all */}
  </Routes>
</BrowserRouter>
  </React.StrictMode>
);
