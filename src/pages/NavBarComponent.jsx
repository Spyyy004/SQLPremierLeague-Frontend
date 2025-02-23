import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import styled from "styled-components";
import logo from "../assets/sqlLogo.webp";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #282a36;
  color: white;

  @media (max-width: 768px) {  /* ✅ Adjust for small screens */
  flex-direction: column;
  align-items: flex-start;
}
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;

  @media (max-width: 768px) {
    display: block; /* ✅ Show menu button on mobile */
  }
`;

const ProfileButton = styled.button`
  background: #60a5fa;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: white;
  cursor: pointer;

  &:hover {
    background: #3b82f6;
  }
`;

const LogoImage = styled.img`
  height: 40px; /* Adjust size as needed */
  cursor: pointer;
`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <NavbarContainer>
      <Link to="/">
        <img src="/sqlLogo.webp" alt="SQL Premier League" height="40" />
      </Link>

      <Link to="/profile">
        <ProfileButton>Profile</ProfileButton>
      </Link>        
      <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X /> : <Menu />}
      </MenuButton>

      {menuOpen && (
        <MobileMenu>
          <Link to="/">Challenges</Link>
          <Link to="/profile">Profile</Link>
        </MobileMenu>
      )}
    </NavbarContainer>
  );
}
