"use client"

import { useState, useEffect, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { Search, Filter, Grid, List, Clock, Award, Users, ChevronRight, ArrowUp, Loader } from "lucide-react";

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Global styles for modern scrollbar
const GlobalStyle = styled.div`
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }
  *::-webkit-scrollbar {
    width: 6px;
  }
  *::-webkit-scrollbar-track {
    background: transparent;
  }
  *::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #13151a 0%, #1e2028 100%);
  color: #e1e2e5;
  padding: 2rem;
  
  @media (max-width: 768px) {  /* ✅ Mobile Support */
    padding: 1rem;
  }
`;


const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  max-width: 600px;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 0.6s ease-out;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #e1e2e5;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }
  
  &::placeholder {
    color: #64748b;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  width: 1rem;
  height: 1rem;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #e1e2e5;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
`;

const ViewButton = styled.button`
  padding: 0.5rem;
  border-radius: 8px;
  border: none;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  color: ${props => props.active ? '#e1e2e5' : '#64748b'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(96, 165, 250, 0.3);
  }
`;

const StatTitle = styled.h3`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: #e1e2e5;
  margin-bottom: 0.25rem;
`;

const StatChange = styled.span`
  font-size: 0.9rem;
  color: ${props => props.positive ? '#4ade80' : '#f87171'};
`;

const ChallengesGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.view === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr'};
  gap: 1.5rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ChallengeCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: ${props => props.view === 'grid' ? 'column' : 'row'};
  gap: 1rem;
  align-items: ${props => props.view === 'grid' ? 'stretch' : 'center'};
  
  &:hover {
    transform: translateY(-2px);
    border-color: #60a5fa;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const CardContent = styled.div`
  flex: 1;
`;

const DifficultyBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.type) {
      case 'easy': return 'rgba(74, 222, 128, 0.1)';
      case 'medium': return 'rgba(250, 204, 21, 0.1)';
      case 'hard': return 'rgba(248, 113, 113, 0.1)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'easy': return '#4ade80';
      case 'medium': return '#facc15';
      case 'hard': return '#f87171';
      default: return '#e1e2e5';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'easy': return 'rgba(74, 222, 128, 0.2)';
      case 'medium': return 'rgba(250, 204, 21, 0.2)';
      case 'hard': return 'rgba(248, 113, 113, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
`;

const QuestionTitle = styled.h2`
  font-size: ${props => props.view === 'grid' ? '1.25rem' : '1.5rem'};
  font-weight: 600;
  color: #e1e2e5;
  margin: 1rem 0;
  line-height: 1.4;
`;

const MetadataContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SolveButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
  color: white;
  border-radius: 12px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
    transform: translateX(4px);
  }
  
  ${props => props.view === 'grid' ? `
    margin-top: 1rem;
    width: 50%;
    justify-content: center;
  ` : `
    flex-shrink: 0;
  `}
`;

const LoadingSpinner = styled(Loader)`
  animation: spin 1s linear infinite;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
`;

const ScrollToTop = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #e1e2e5;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${props => props.visible ? '1' : '0'};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("grid");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sortBy, setSortBy] = useState("difficulty");

  useEffect(() => {
    fetchChallenges();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getSuccessRate = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return `${Math.floor(Math.random() * (70 - 55 + 1)) + 55}% success`; // 85% - 95%
      case "medium":
        return `${Math.floor(Math.random() * (70 - 55 + 1)) + 55}% success`; // 70% - 85%
      case "hard":
        return `${Math.floor(Math.random() * (70 - 55 + 1)) + 55}% success`; // 55% - 70%
      default:
        return `80 % success`; // Default value
    }
  };
  
  // Function to generate randomized attempts count
  const getAttempts = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return Math.floor(Math.random() * (500 - 300 + 1)) + 300; // 300 - 500
      case "medium":
        return Math.floor(Math.random() * (300 - 150 + 1)) + 150; // 150 - 300
      case "hard":
        return Math.floor(Math.random() * (150 - 50 + 1)) + 50; // 50 - 150
      default:
        return 200; // Default value
    }
  };
  
  // Function to get time estimate based on difficulty
  const getTimeEstimate = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "~5 mins";
      case "medium":
        return "~10 mins";
      case "hard":
        return "~15 mins";
      default:
        return "~10 mins";
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshtoken");
      if (!refreshToken) throw new Error("No refresh token found");
  
      const response = await fetch("https://sqlpremierleague-backend.onrender.com/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
        credentials: "include"
      });
  
      if (!response.ok) throw new Error("Failed to refresh token");
  
      const data = await response.json();
      localStorage.setItem("token", data.access_token); // ✅ Store new access token
  
      return data.access_token;
    } catch (error) {
      console.error("Refresh token failed. Logging out.", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshtoken");
      window.location.href = "/signin"; // Redirect to login
      return null;
    }
  };
  
  const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem("token");
  
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  
    let response = await fetch(url, options);
  
    if (response.status === 401) {
      console.warn("Access token expired. Refreshing...");
      
      const newToken = await refreshAccessToken();
      if (!newToken) return null; // If refresh fails, user is logged out
  
      options.headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, options); // Retry request with new token
    }
  
    return response;
  };

  const handleScroll = () => {
    setShowScrollTop(window.pageYOffset > 400);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWithAuth(
        "https://sqlpremierleague-backend.onrender.com/challenges",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch challenges");
      
      const data = await response.json();
      setChallenges(data.challenges);
    } catch (error) {
      setError("Failed to load challenges. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedChallenges = useMemo(() => {
    let filtered = challenges
      .filter((q) => difficulty === "all" ? true : q.type === difficulty)
      .filter((q) => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    switch (sortBy) {
      case "newest":
        return [...filtered].sort((a, b) => b.id - a.id);
      case "oldest":
        return [...filtered].sort((a, b) => a.id - b.id);
      case "difficulty":
        return [...filtered].sort((a, b) => {
          const order = { easy: 1, medium: 2, hard: 3 };
          return order[a.type] - order[b.type];
        });
      default:
        return filtered;
    }
  }, [challenges, difficulty, searchQuery, sortBy]);

  const stats = useMemo(() => {
    const easyChallenges = challenges.filter(c => c.type === 'easy');
    const mediumChallenges = challenges.filter(c => c.type === 'medium');
    const hardChallenges = challenges.filter(c => c.type === 'hard');
    
    return {
      total: challenges.length,
      easy: easyChallenges.length,
      medium: mediumChallenges.length,
      hard: hardChallenges.length,
      easySubmissions: easyChallenges.reduce((sum, c) => sum + (c.submissions || 0), 0),
      mediumSubmissions: mediumChallenges.reduce((sum, c) => sum + (c.submissions || 0), 0),
      hardSubmissions: hardChallenges.reduce((sum, c) => sum + (c.submissions || 0), 0)
    };
  }, [challenges]);
  

  if (error) {
    return (
      <PageContainer>
        <ContentWrapper>
          <div className="text-center text-red-400 p-8">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
            <button 
              onClick={fetchChallenges}
              className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
            >
              Try Again
            </button>
          </div>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <GlobalStyle>
      <PageContainer>
        <ContentWrapper>
        

          {/* Stats Section */}
          <StatsGrid>
            <StatCard>
              <StatTitle>Total Challenges</StatTitle>
              <StatValue>{stats.total}</StatValue>
              <StatChange positive>+5 this week</StatChange>
            </StatCard>
            <StatCard>
              <StatTitle>Easy Challenges</StatTitle>
              <StatValue>{stats.easy}</StatValue>
              <MetadataItem>
                <Award size={16} />
                {stats.easySubmissions} Submissions
              </MetadataItem>
            </StatCard>
            <StatCard>
              <StatTitle>Medium Challenges</StatTitle>
              <StatValue>{stats.medium}</StatValue>
              <MetadataItem>
                <Award size={16} />
                {stats.mediumSubmissions} Submissions
              </MetadataItem>
            </StatCard>
            <StatCard>
              <StatTitle>Hard Challenges</StatTitle>
              <StatValue>{stats.hard}</StatValue>
              <MetadataItem>
                <Award size={16} />
                {stats.hardSubmissions} Submissions
              </MetadataItem>
            </StatCard>
          </StatsGrid>

          <ControlsContainer>
            <SearchBox>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search challenges"
              />
            </SearchBox>

            <FilterControls>
              <Select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                aria-label="Filter by difficulty"
              >
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Select>

              <Select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort challenges"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="difficulty">By Difficulty</option>
              </Select>

              <ViewToggle>
                <ViewButton
                  active={view === 'grid'}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                >
                  <Grid size={18} />
                </ViewButton>
                <ViewButton
                  active={view === 'list'}
                  onClick={() => setView('list')}
                  aria-label="List view"
                >
                  <List size={18} />
                </ViewButton>
              </ViewToggle>
            </FilterControls>
          </ControlsContainer>

          {loading ? (
            <LoadingContainer>
              <LoadingSpinner size={32} />
            </LoadingContainer>
          ) : filteredAndSortedChallenges.length > 0 ? (
            <ChallengesGrid view={view}>
              {filteredAndSortedChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} view={view}>
                  <CardContent>
                    <DifficultyBadge type={challenge.type}>
                      {challenge.type.toUpperCase()}
                    </DifficultyBadge>
                    <QuestionTitle view={view}>{challenge.question}</QuestionTitle>
                    <MetadataContainer>
                      <MetadataItem>
                        <Clock size={16} />
                        {getTimeEstimate(challenge.type)}
                      </MetadataItem>
                      <MetadataItem>
                        <Users size={16} />
                        {getAttempts(challenge.type)}
                      </MetadataItem>
                      <MetadataItem>
                        <Award size={16} />
                       {getSuccessRate(challenge.type)}
                      </MetadataItem>
                    </MetadataContainer>
                  </CardContent>
                  <SolveButton href={`/solve/${challenge.id}`} view={view}>
                    Solve Challenge
                    <ChevronRight size={16} />
                  </SolveButton>
                </ChallengeCard>
              ))}
            </ChallengesGrid>
          ) : (
            <NoResults>
              <h3 className="text-xl font-semibold mb-2">No challenges found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </NoResults>
          )}

          <ScrollToTop visible={showScrollTop} onClick={scrollToTop}>
            <ArrowUp size={20} />
          </ScrollToTop>
        </ContentWrapper>
      </PageContainer>
    </GlobalStyle>
  );
}