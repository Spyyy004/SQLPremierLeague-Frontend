import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Trophy, Medal, Crown, Star } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const LeaderboardContainer = styled.div`
  height: 100vh;
  padding: 2.5rem;
  background: linear-gradient(145deg, rgba(30, 30, 46, 0.9), rgba(40, 42, 54, 0.9));

  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  h2 {
    font-size: 2.5rem;
    background: linear-gradient(120deg, #60a5fa, #818cf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }
`;

const TopThree = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 3rem;
  gap: 1.5rem;
  padding: 0 1rem;
`;

const PodiumPlace = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .position {
    font-size: ${props => props.position === 1 ? '2.5rem' : '2rem'};
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: ${props => {
      switch (props.position) {
        case 1: return '#FFD700';
        case 2: return '#C0C0C0';
        case 3: return '#CD7F32';
        default: return '#fff';
      }
    }};
  }

  .avatar {
    width: ${props => props.position === 1 ? '100px' : '80px'};
    height: ${props => props.position === 1 ? '100px' : '80px'};
    border-radius: 50%;
    background: ${props => {
      switch (props.position) {
        case 1: return 'linear-gradient(45deg, #FFD700, #FFA500)';
        case 2: return 'linear-gradient(45deg, #C0C0C0, #A0A0A0)';
        case 3: return 'linear-gradient(45deg, #CD7F32, #8B4513)';
        default: return '#444';
      }
    }};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .username {
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  .xp {
    font-size: 1rem;
    color: #60a5fa;
    font-weight: 500;
  }
`;

const LeaderboardList = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const LeaderboardItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  background: ${props => props.isCurrentUser ? 'rgba(96, 165, 250, 0.1)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }

  .rank {
    width: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    color: ${props => props.isCurrentUser ? '#60a5fa' : '#888'};
  }

  .username {
    flex: 1;
    font-size: 1.1rem;
    color: ${props => props.isCurrentUser ? '#fff' : '#ddd'};
    font-weight: ${props => props.isCurrentUser ? '600' : '400'};
  }

  .xp {
    font-size: 1.1rem;
    color: #60a5fa;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const UserRankContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(to right, rgba(96, 165, 250, 0.1), rgba(96, 165, 250, 0.05));
  border-radius: 12px;
  font-size: 1.2rem;
  border: 1px solid rgba(96, 165, 250, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  animation: ${fadeIn} 0.6s ease-out;

  .rank {
    color: #60a5fa;
    font-weight: 600;
  }

  .username {
    color: #fff;
    font-weight: 500;
  }

  .xp {
    color: #60a5fa;
    font-weight: 500;
  }
`;

const LoadingState = styled.div`
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .loading-bar {
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    
    &::after {
      content: '';
      display: block;
      width: 40%;
      height: 100%;
      background: linear-gradient(90deg, transparent, #60a5fa, transparent);
      animation: ${shimmer} 1.2s infinite;
    }
  }
`;

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://sqlpremierleague-backend.onrender.com/leaderboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      const data = await response.json();
      setLeaderboard(data.leaderboard);
      setUserRank(data.user_rank);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LeaderboardContainer>
        <LoadingState>
          <div className="loading-bar" />
        </LoadingState>
      </LeaderboardContainer>
    );
  }

  // Separate top 3 from the rest
  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  return (
    <LeaderboardContainer>
      <Title>
        <Trophy size={32} color="#60a5fa" />
        <h2>Leaderboard</h2>
      </Title>

      <TopThree>
        {topThree.map((user, index) => (
          <PodiumPlace key={index} position={index + 1}>
            <div className="position">
              {index + 1 === 1 && <Crown size={32} />}
              {index + 1 === 2 && <Medal size={28} />}
              {index + 1 === 3 && <Star size={28} />}
            </div>
            <div className="avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="username">{user.username}</div>
            <div className="xp">{user.xp} XP</div>
          </PodiumPlace>
        ))}
      </TopThree>

      <LeaderboardList>
        {restOfLeaderboard.map((user, index) => (
          <LeaderboardItem 
            key={index + 3}
            isCurrentUser={userRank && user.username === userRank.username}
          >
            <span className="rank">#{index + 4}</span>
            <span className="username">{user.username}</span>
            <span className="xp">
              {user.xp} XP
              {userRank && user.username === userRank.username && <Star size={16} color="#60a5fa" />}
            </span>
          </LeaderboardItem>
        ))}
      </LeaderboardList>

      {userRank && userRank.rank > 10 && (
        <UserRankContainer>
          <span className="rank">#{userRank.rank}</span>
          <span className="username">{userRank.username}</span>
          <span className="xp">{userRank.xp} XP</span>
        </UserRankContainer>
      )}
    </LeaderboardContainer>
  );
}