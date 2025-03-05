import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Lock, ArrowLeft, Loader, AlertTriangle, Database, Star, X, Trophy } from "lucide-react";
import ChallengeOfTheDay from "./ChallengeOfTheDay";

// 🎨 Updated Theme Colors
const primaryColor = "#282a36"; // Updated page background
const accentColor = "#3b82f6"; // Brighter blue for action elements
const textColor = "#f8fafc"; // Light text for better contrast
const cardBgColor = "#1e1e2e"; // Darker background for sport cards
const errorColor = "#ef4444"; // Red for error states

// 🏆 Page Container with Updated Background
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${primaryColor};
  color: ${textColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3rem;
`;

// 🔙 Header Section
const Header = styled.header`
  width: 100%;
  max-width: 1100px;
  display: flex;
  align-items: center;
  padding: 1rem;
`;

const BackButton = styled.button`
  background: ${accentColor};
  border: none;
  color: white;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  
  &:hover {
    background: #2563eb;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-left: 1rem;
`;

// � Main Content Styling
const MainContent = styled.main`
  max-width: 1100px;
  width: 100%;
  padding: 1rem;
  margin-top: 2rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

// 🏆 Sport Cards
const SportCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  
  padding: 2rem;
  background: ${cardBgColor};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${({ available }) => (available ? "pointer" : "not-allowed")};
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

  ${({ available }) => available && `
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0px 8px 20px rgba(37, 99, 235, 0.3);
    }
  `}
`;

const SportIcon = styled.span`
  font-size: 3.5rem;
  display: block;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;

  ${SportCard}:hover & {
    transform: scale(1.1);
  }
`;

const SportName = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
`;

// Improved consistent styling for question count
const QuestionCount = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: rgba(59, 130, 246, 0.2);
  font-weight: 500;
  color: ${textColor};
  transition: background 0.3s ease;

  ${SportCard}:hover & {
    background: rgba(59, 130, 246, 0.4);
  }
`;

const CTAButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  background: ${accentColor};
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LockedOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  color: #d1d5db;
  transition: opacity 0.3s ease;

  ${SportCard}:hover & {
    opacity: 0.9;
  }
`;

const ComingSoonText = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`;

// 🏆 States: Loading, Empty, and Error
const StateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 16rem;
  text-align: center;
  padding: 2rem;
`;

const SpinningLoader = styled(Loader)`
  color: ${accentColor};
  animation: spin 1s linear infinite;
  font-size: 2rem;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// New Empty State component
const EmptyState = styled.div`
  background: ${cardBgColor};
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
`;
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Card = styled.div`
  background: #1e1e2e;
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  text-align: center;
  font-weight: bold;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 165, 0, 0.4);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #15151f;
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  width: 420px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: white;
  }
`;

const Title = styled.h2`
  color: #f8fafc;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Description = styled.p`
  color: #bbb;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;

  width: 100%
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.3s ease;

  background: ${props => (props.primary ? "#60a5fa" : "#ef4444")};
  color: white;

  &:hover {
    background: ${props => (props.primary ? "#2563eb" : "#dc2626")};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;


const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const EmptyStateMessage = styled.p`
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
`;

// New Error State component
const ErrorIcon = styled(AlertTriangle)`
  color: ${errorColor};
  margin-bottom: 1rem;
`;

const RefreshButton = styled(CTAButton)`
  background: ${errorColor};
  &:hover {
    background: #dc2626;
  }
`;

export default function SportSelection() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const fetchSports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://sqlpremierleague-backend.onrender.com/categories");
      const data = await response.json();

      const sportsData = [
        { id: "EPL", name: "Premier League", icon: "⚽", available: true },
        { id: "cricket", name: "IPL", icon: "🏏", available: true },
        { id: "NBA", name: "NBA", icon: "🏀", available: true },
        { id: "F1", name: "Formula 1", icon: "🏎️", available: true },
        { id: "nfl", name: "NFL", icon: "🏈", available: false },
       
      ].map((sport) => ({
        ...sport,
        questionCount: data.categories.find((c) => c.category === sport.id)?.question_count || 0
      }));

      setSports(sportsData);
    } catch (err) {
      console.error("Failed to load sports data:", err);
      setError("Unable to load sports data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    setModalOpen(false);
    navigate("/sql-test");
  };


  useEffect(() => {
    fetchSports();
  }, []);

  const handleSelectSport = (sport) => {
    if (sport.available) {
      navigate(`/challenges?category=${sport.id}`);
    }
  };


  // Render appropriate state based on loading/error/empty conditions
  const renderContent = () => {
    if (loading) {
      return (
        <StateContainer>
          <SpinningLoader size={48} />
          <p style={{ marginTop: "1rem" }}>Loading available sports...</p>
        </StateContainer>
      );
    }

    if (error) {
      return (
        <StateContainer>
          <ErrorIcon size={48} />
          <EmptyStateTitle>Something went wrong</EmptyStateTitle>
          <EmptyStateMessage>{error}</EmptyStateMessage>
          <RefreshButton onClick={fetchSports}>Try Again</RefreshButton>
        </StateContainer>
      );
    }

    if (sports.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>🔍</EmptyStateIcon>
          <EmptyStateTitle>No Sports Available</EmptyStateTitle>
          <EmptyStateMessage>
            We couldn't find any sports categories right now. Please check back later or contact support if the problem persists.
          </EmptyStateMessage>
          <CTAButton onClick={fetchSports}>Refresh</CTAButton>
        </EmptyState>
      );
    }

    return (
      <>
        {/* ✅ Add Challenge of the Day Card */}
        <ChallengeOfTheDay />

        <CardGrid>
          {sports.map((sport) => (
            <SportCard 
              key={sport.id} 
              available={sport.available}
              onClick={() => sport.available && handleSelectSport(sport)}
              role="button"
              aria-disabled={!sport.available}
              tabIndex={sport.available ? 0 : -1}
            >
              <SportIcon role="img" aria-label={`${sport.name} icon`}>{sport.icon}</SportIcon>
              <SportName>{sport.name}</SportName>
              <QuestionCount>{sport.questionCount} Questions</QuestionCount>
              {sport.available ? (
                <CTAButton>Start Playing</CTAButton>
              ) : (
                <LockedOverlay>
                  <Lock size={32} />
                  <ComingSoonText>Coming Soon</ComingSoonText>
                </LockedOverlay>
              )}
            </SportCard>
          ))}
            <SportCard onClick={() => setModalOpen(true)}>
            <Trophy size={48} />
            <SportName>The SQL Test</SportName>
            <CTAButton>Check my SQL Score</CTAButton>
          </SportCard>
        </CardGrid>
       
      </>
    );
};


  return (
    <PageContainer>
      
      <MainContent>
        {renderContent()}
      </MainContent>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <Title>SQL Score Test 🏆</Title>
            <Description>Test your SQL skills in a 2-minute challenge!</Description>
            <ButtonContainer>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button primary onClick={handleStartTest}>Start Test</Button>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}