import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { User, Share, Star, Coffee } from "lucide-react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #13151a;
  color: white;
  text-align: center;
  padding: 2rem;
`;

const Header = styled.header`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Logo = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-top: 3rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #b3b3b3;
  margin-top: 0.5rem;
`;

const StartButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: #60a5fa;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.3s;

  &:hover {
    background: #3b82f6;
  }
`;

export default function LandingPage() {
  return (
    <Container>
      <Header>
        <Link to="/signin">
          <NavButton>
            <User size={16} /> Profile
          </NavButton>
        </Link>
     
      
        <NavButton onClick={() => window.open("https://buymeacoffee.com/iyushpawar", "_blank")}>
          <Coffee size={16} /> Buy Me a Coffee
        </NavButton>
      </Header>

      <Logo>SQL Premier League</Logo>
      <Subtitle>Enhance your SQL skills with real-world challenges.</Subtitle>

      <StartButton to="/challenges">Start Solving</StartButton>
    </Container>
  );
}
