import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/sqlLogo.webp";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #282a36;
  color: white;
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
  return (
    <NavbarContainer>
      <Link to="/">
      <LogoImage src={logo} alt="" /></Link>
      <Link to="/profile">
        <ProfileButton>Profile</ProfileButton>
      </Link>
    </NavbarContainer>
  );
}
