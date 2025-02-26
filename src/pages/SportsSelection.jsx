import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Lock, ArrowLeft, Loader } from "lucide-react";

// 🎨 Updated Theme Colors
const primaryColor = "#282a36"; // Updated page background
const accentColor = "#3b82f6"; // Brighter blue for action elements
const textColor = "#f8fafc"; // Light text for better contrast
const cardBgColor = "#1e1e2e"; // Darker background for sport cards

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
  transition: background 0.2s ease;
  
  &:hover {
    background: #2563eb;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-left: 1rem;
`;

// 🏆 Main Content Styling
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
  box-shadow: ${({ available }) => (available ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none")};

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
`;

const SportName = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
`;

const QuestionCount = styled.div`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: ${({ available }) => (available ? accentColor : "#4b5563")};
  font-weight: 500;
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
  transition: background 0.3s ease;
  
  &:hover {
    background: #2563eb;
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
  backdrop-filter: blur(4px);
  color: #d1d5db;
`;

const ComingSoonText = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`;

// 🏆 Loader for Loading State
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16rem;
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

export default function SportSelection() {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://sqlpremierleague-backend.onrender.com/categories");
        const data = await response.json();

        const sportsData = [
          { id: "EPL", name: "Premier League", icon: "⚽", available: true },
          { id: "cricket", name: "Cricket", icon: "🏏", available: true },
          { id: "nfl", name: "NFL", icon: "🏈", available: false },
          { id: "nba", name: "Basketball", icon: "🏀", available: false },
          { id: "f1", name: "Formula 1", icon: "🏎️", available: false }
        ].map((sport) => ({
          ...sport,
          questionCount: data.categories.find((c) => c.category === sport.id)?.question_count || 0
        }));

        setSports(sportsData);
      } catch (err) {
        console.error("Failed to load sports data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  const handleSelectSport = (sport) => {
    if (sport.available) {
      navigate(`/challenges?category=${sport.id}`);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
     

      <MainContent>
        {/* Loading State */}
        {loading ? (
          <LoadingContainer>
            <SpinningLoader size={48} />
          </LoadingContainer>
        ) : (
          <CardGrid>
            {sports.map((sport) => (
              <SportCard key={sport.id} available={sport.available}>
                <SportIcon>{sport.icon}</SportIcon>
                <SportName>{sport.name}</SportName>
                <QuestionCount available={sport.available}>{sport.questionCount} Questions</QuestionCount>
                {sport.available ? (
                  <CTAButton onClick={() => handleSelectSport(sport)}>Start Playing</CTAButton>
                ) : (
                  <LockedOverlay>
                    <Lock size={32} />
                    <ComingSoonText>Coming Soon</ComingSoonText>
                  </LockedOverlay>
                )}
              </SportCard>
            ))}
          </CardGrid>
        )}
      </MainContent>
    </PageContainer>
  );
}
