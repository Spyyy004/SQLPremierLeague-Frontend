import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import ChallengesPage from "./pages/ChallengesPage";
import ProblemPage from "./pages/ProblemPage";
import ProfilePage from "./pages/ProfilePage";
import ReactGA from "react-ga4";
import SignInPage from "./pages/SignInPage"; // ✅ Ensure this file exists
import LandingPage from "./pages/LandingPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SportSelection from "./pages/SportsSelection";
import Mixpanel from "./utils/mixpanel";
import SQLScoreTest from "./pages/SqlScoreProblemPage";
import SQLTestProblemPage from "./pages/SqlScoreProblemPage";
import GlobalStyle from './globalStyles'; 
import SqlTestResults from "./pages/SqlTestResults";

ReactGA.initialize("G-3FQ42ZFRQN"); 

const trackPageView = (location) => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });

};

function RouterWithAnalytics({ children }) {
  useEffect(()=>{
    Mixpanel.track("Page Viewed", { page: window.location.pathname });
    trackPageView();
  })
  return (
    <BrowserRouter basename="/">
      {children}
    </BrowserRouter>
  );
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterWithAnalytics>
    <GlobalStyle />
    
  <Routes>
      <Route index element={<LandingPage />} /> {/* ✅ Default route */}
    <Route path="/" element={<Layout />}>
      <Route path="/challenges" element={<ChallengesPage/>}/>
      <Route path="solve/:id" element={<ProblemPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="/categories" element={<SportSelection/>}/>
      <Route path ="/leaderboard" element={<LeaderboardPage/>}/>
      <Route path="/sql-test" element={<SQLTestProblemPage/>}/>
      <Route path="/sql-test-result" element={<SqlTestResults></SqlTestResults>}/>
    </Route>
    <Route path="signin" element={<SignInPage />} /> {/* ✅ No extra "/" */}
    <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* ✅ Catch-all */}
  </Routes>
  </RouterWithAnalytics>
  </React.StrictMode>
);
