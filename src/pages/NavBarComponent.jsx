import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, User, Award } from "lucide-react";
import styled from "styled-components";

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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [xp, setXP] = useState(0);

  useEffect(() => {
    fetchXP();
  }, []);

  const fetchXP = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://sqlpremierleague-backend.onrender.com/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch XP");

      const data = await response.json();
      setXP(data.xp || 0);
    } catch (error) {
      console.error("Error fetching XP:", error);
    }
  };

  return (
    <NavbarContainer>
      {/* Left Section: Logo */}
      <LeftContainer>
        <Link to="/challenges">
          <img src="/sqlLogo.webp" alt="SQL Premier League" height="40" />
        </Link>
      </LeftContainer>

      {/* Right Section: XP & Profile Icon */}
      <RightContainer>
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
    </NavbarContainer>
  );
}
