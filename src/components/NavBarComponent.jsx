import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, Award, BarChart2, LogIn } from "lucide-react";
import styled from "styled-components";
import Mixpanel from "../utils/mixpanel";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #282a36;
  color: white;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem; /* Adds space between XP and Profile Icon */
`;

const CloseButton = styled.button`
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: #ef4444;
  border: none;
  color: white;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const XPContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #60a5fa;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 8px;
`;

const ProfileIcon = styled(User)`
  width: 28px;
  height: 28px;
  color: white;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #60a5fa;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;
const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  color: white;

  &:hover {
    color: #60a5fa;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const Popup = styled.div`
  background: #1e1e2e;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  position: relative;
`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [xp, setXP] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef(null);

  useEffect(() => {
    fetchXP();
  }, );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowLoginPopup(false);
      }
    };

    if (showLoginPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLoginPopup]);

  const handleLogin = () => {
    window.location.href = "/signin";
  };

  const fetchXP = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://sqlpremierleague-backend.onrender.com/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch XP");

      const data = await response.json();
      setIsLoggedIn(true);
      setXP(data.xp || 0);
    } catch (error) {
      console.error("Error fetching XP:", error);
      setIsLoggedIn(false);
    }
  };

  const handleLeaderboardClick = () => {
    Mixpanel.track("Leaderboard Clicked", { is_logged_in: isLoggedIn });

    if (!isLoggedIn) {
      setShowLoginPopup(true);
      Mixpanel.track("Leaderboard Access Blocked", { reason: "User Not Logged In" });
    } else {
      navigate("/leaderboard");
      Mixpanel.track("Leaderboard Accessed", { user: "Logged In" });
    }
  };

  return (
    <NavbarContainer>
      <LeftContainer>
        <Link to="/categories">
          <img src="/sqlLogo.webp" alt="SQL Premier League" height="40" />
        </Link>
      </LeftContainer>

      <RightContainer>
        <IconButton onClick={handleLeaderboardClick}>
          <BarChart2 size={28} />
        </IconButton>
        <XPContainer>
          <Award size={20} /> {xp} XP
        </XPContainer>
        <Link to="/profile">
          <ProfileIcon />
        </Link>
      </RightContainer>

      <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X /> : <Menu />}
      </MenuButton>

      {showLoginPopup && (
        <PopupOverlay>
          <Popup ref={popupRef}>
            <LogIn size={40} color="#60a5fa" />
            <h3 style={{ color: "#fff", marginBottom: "1rem" }}>Login Required</h3>
            <p style={{ color: "#bbb" }}>You need to log in to see the leaderboard.</p>
            <CloseButton onClick={handleLogin}>Go to Login</CloseButton>
          </Popup>
        </PopupOverlay>
      )}
    </NavbarContainer>
  );
}
