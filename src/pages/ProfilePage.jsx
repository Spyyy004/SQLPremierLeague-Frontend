
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { LogOut, Edit, Calendar, Clock, Shield, Star, Trophy, Zap } from "lucide-react";

// 🔹 Subtle fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// 🔹 Optimized layout for single-view without scrolling
const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #13151a 0%, #1e2028 100%);
  padding: 1.5rem;
`;

const GlassCard = styled.div`
  width: 90%;

  height: 85vh;
  display: flex;
  grid-template-columns: 300px 1fr;
  grid-gap: 1.5rem;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  animation: ${fadeIn} 0.5s ease-out;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const ProfileSidebar = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  width: 45%;
  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 1rem;
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const AvatarContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
`;

const Avatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 20px rgba(96, 165, 250, 0.5);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
`;

const Email = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const MemberSince = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  color: #cbd5e1;
  font-size: 0.8rem;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
  margin: 1rem 0;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 0.8rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(96, 165, 250, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  color: #60a5fa;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
`;

const XPBarContainer = styled.div`
  margin: 1rem 0;
`;

const XPBarBackground = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const XPBar = styled.div`
  height: 100%;
  width: ${(props) => props.percentage}%;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  border-radius: 4px;
`;

const XPLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #94a3b8;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: auto;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.8rem;
  background: ${props => props.primary ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' : 'rgba(255, 255, 255, 0.06)'};
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.12)'};
  border-radius: 12px;
  color: ${props => props.primary ? 'white' : '#e2e8f0'};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.primary ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 55%;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RecentActivity = styled.div`
  flex: 1;
  overflow-y: auto;
 
  background: rgba(255, 255, 255, 0.04);
  border-radius: 16px;
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.8rem;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const ActivityItem = styled.div`
  padding: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityTime = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  margin-left: auto;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  height: 100vh;
  justify-content: center;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(96, 165, 250, 0.3);
  border-top: 3px solid #60a5fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
  try {
    // Call the backend logout API
    await fetch("https://sqlpremierleague-backend.onrender.com/logout", {
      method: "POST",
      credentials: "include", // Ensures cookies (JWT tokens) are cleared
    });

    // Clear tokens and redirect to the sign-in page
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("csrf_token");
    localStorage.removeItem("user_id");
    // Redirect user to sign-in page
    navigate('/signin');
  } catch (error) {
  }
};


  const fetchProfile = async () => {
    try {
      const response = await fetch("https://sqlpremierleague-backend.onrender.com/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (!response.ok) {
        navigate('/signin');
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      navigate('/signin');
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <p style={{ color: '#94a3b8' }}>Loading your profile...</p>
        </LoadingContainer>
      </PageContainer>
    );
  }

  // Get first letter of username for avatar
  const userInitial = user?.username ? user.username[0].toUpperCase() : '?';
  
  // Calculate XP percentage
  const xpPercentage = (user?.xp % 1000) / 10;
  
  return (
    <PageContainer>
      <GlassCard>
        {/* Left Sidebar with Profile Info */}
        <ProfileSidebar>
          <ProfileHeader>
            <AvatarContainer>
              <Avatar>{userInitial}</Avatar>
            </AvatarContainer>
            <Title>{user?.username}</Title>
            <Email>{user?.email}</Email>
            <MemberSince>
              <Calendar size={14} /> Since: {user?.member_since}
            </MemberSince>
          </ProfileHeader>

          <StatsGrid>
            <StatCard>
              <IconContainer>
                <Trophy size={16} color="#60a5fa" />
              </IconContainer>
              <StatValue>{user?.rank || "N/A"}</StatValue>
              <StatLabel>Rank</StatLabel>
            </StatCard>
            
            <StatCard>
              <IconContainer>
                <Shield size={16} color="#60a5fa" />
              </IconContainer>
              <StatValue>{user?.daily_streak || 0} 🔥</StatValue>
              <StatLabel>Streak</StatLabel>
            </StatCard>
            
            <StatCard>
              <IconContainer>
                <Zap size={16} color="#60a5fa" />
              </IconContainer>
              <StatValue>{user?.fastest_query_time || "N/A"}</StatValue>
              <StatLabel>Fastest Query (ms)</StatLabel>
            </StatCard>
            
            <StatCard>
              <IconContainer>
                <Star size={16} color="#60a5fa" />
              </IconContainer>
              <StatValue>{user?.xp}</StatValue>
              <StatLabel>XP</StatLabel>
            </StatCard>
          </StatsGrid>

          {/* XP Progress Bar */}
          <XPBarContainer>
            <StatLabel style={{ marginBottom: '0.5rem' }}>Level Progress</StatLabel>
            <XPBarBackground>
              <XPBar percentage={xpPercentage} />
            </XPBarBackground>
            <XPLabelContainer>
              <span>{user?.xp % 1000}</span>
              <span>1000</span>
            </XPLabelContainer>
          </XPBarContainer>

          {/* Buttons */}
          <ButtonGroup>
            {/* <Button primary onClick={() => navigate('/edit-profile')}>
              <Edit size={16} /> Edit
            </Button> */}
            <Button onClick={() => handleLogout()}>
              <LogOut size={16} /> Logout
            </Button>
          </ButtonGroup>
        </ProfileSidebar>

        {/* Right Content Area with Recent Activity */}
        <ContentArea>
          <ContentHeader>
            <SectionTitle>
              <Clock size={18} /> Recent Activity
            </SectionTitle>
          </ContentHeader>
          
          <RecentActivity>
            {user?.recent_activity && user.recent_activity.length > 0 ? (
              user.recent_activity.map((activity, index) => (
                <ActivityItem key={index}>
                  <Clock size={14} color="#60a5fa" /> 
                  <div>{activity.question}</div>
                  <ActivityTime>{new Date(activity.submitted_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</ActivityTime>
                </ActivityItem>
              ))
            ) : (
              <ActivityItem>No recent activity</ActivityItem>
            )}
          </RecentActivity>
        </ContentArea>
      </GlassCard>
    </PageContainer>
  );
}