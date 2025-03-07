import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, {createGlobalStyle} from "styled-components";
import { User, Share, Star, Coffee, ChevronDown, Code, Trophy, Users, Database, Github } from "lucide-react";
import TerminalEffect from "../components/TerminalEffect";
import Mixpanel from "../utils/mixpanel";
import { Helmet } from "react-helmet";



// Animated gradient background

const GlobalStyle = createGlobalStyle`
  
  * {
    font-family: 'Gentium Book Plus', serif;
  }
`;
const GradientBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(125deg, #13151a 0%, #1a1d24 25%, #242936 50%, #1e2533 75%, #13151a 100%);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  z-index: -1;
  
  @keyframes gradientAnimation {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  color: white;
  text-align: center;
  padding: 0 2rem;
  overflow-x: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(19, 21, 26, 0.8);
  backdrop-filter: blur(8px);
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SmallLogo = styled.img`
  height: 32px;
  
  @media (max-width: 768px) {
    height: 24px;
  }
`;

const LogoText = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  font-family: 'Gentium Book Plus',serif !important;
  @media (max-width: 768px) {
    display: none;
  }
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
  transition: all 0.2s;
  font-weight: 500;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  max-width: 1200px;
  padding-top: 4rem;
`;

const LogoImage = styled.img`
  height: 120px;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 12px rgba(96, 165, 250, 0.6));
  animation: pulse 3s infinite;
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @media (max-width: 768px) {
    height: 80px;
  }
`;

const Logo = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(90deg, #60a5fa, #3b82f6, #2563eb);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #e2e8f0;
  margin: 1rem 0 2rem;
  font-weight: 500;
  max-width: 600px;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;
  width: 100%;
  max-width: 1000px;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(96, 165, 250, 0.3);
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.2);
  margin-bottom: 1rem;
  color: #60a5fa;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #b3b3b3;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
  
  @media (max-width: 500px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const StartButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.5);
  
  &:hover {
    background: linear-gradient(90deg, #2563eb, #1d4ed8);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
  }
  
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  @media (max-width: 500px) {
    width: 100%;
  }
`;



const Footer = styled.footer`
  width: 100%;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #b3b3b3;
  font-size: 0.9rem;
  margin-top: auto;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const FooterLink = styled.a`
  color: #e2e8f0;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #60a5fa;
  }
`;

const ScrollPrompt = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #e2e8f0;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
    40% { transform: translateY(-20px) translateX(-50%); }
    60% { transform: translateY(-10px) translateX(-50%); }
  }
`;

const ScrollText = styled.span`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
        setShowScrollPrompt(false);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 
 
  
  return (
    <>

      <GradientBackground />
      <Container>
        <Header style={{ boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none' }}>
          <LogoContainer>
            <SmallLogo src="/sqlLogo.webp" alt="SQL Premier League" />
            <LogoText>SQL Premier League</LogoText>
          </LogoContainer>
          <NavButtons>
          <NavButton onClick={() => window.open("https://github.com/Spyyy004/SQLPremierLeague-Frontend", "_blank")}>
         <Github size={16} />Star on Github
        </NavButton>

          
            <NavButton onClick={() => window.open("https://buymeacoffee.com/iyushpawar", "_blank")}>
         <Coffee size={16} /> Support the Project
        </NavButton>
         
          </NavButtons>
        </Header>
        
        <HeroSection>
          <LogoImage src="/sqlLogo.webp" alt="SQL Premier League Logo" />
          <Logo>SQL Premier League</Logo>
          <Subtitle>Master SQL with your favourite sports</Subtitle>
          
          <TerminalEffect />
          
          <ButtonContainer>
            <StartButton to="/categories">
              Start Playing
            </StartButton>
         
          </ButtonContainer>
          
         
        </HeroSection>
      
      </Container>

    </>
  );
}