import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { LogOut, User, Mail, CheckCircle, Target, Award, Loader2, AlertTriangle } from "lucide-react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #13151a 0%, #1e2028 100%);
  padding: 2rem;
`;

const GlassCard = styled.div`
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const AvatarContainer = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: bold;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const Email = styled.p`
  color: #94a3b8;
  font-size: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.25rem;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #60a5fa;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const InfoSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div`
  margin-right: 1rem;
  color: #60a5fa;
  display: flex;
  align-items: center;
`;

const InfoLabel = styled.div`
  color: #94a3b8;
  flex: 1;
`;

const InfoValue = styled.div`
  color: #e1e2e5;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #94a3b8;
  gap: 1rem;
`;

const ErrorState = styled.div`
  text-align: center;
  color: #ef4444;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "https://sqlpremierleague-backend.onrender.com/profile",
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials : 'include'
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshtoken");
    document.cookie.split(";").forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
    });
    navigate("/signin");
  };

  if (loading) {
    return (
      <PageContainer>
        <GlassCard>
          <LoadingState>
            <Loader2 size={40} className="animate-spin" />
            <div>Loading your profile...</div>
          </LoadingState>
        </GlassCard>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <GlassCard>
          <ErrorState>
            <AlertTriangle size={40} />
            <div>Failed to load profile</div>
            <LogoutButton onClick={handleLogout}>
              Return to Login
              <LogOut size={18} />
            </LogoutButton>
          </ErrorState>
        </GlassCard>
      </PageContainer>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <GlassCard>
        <ProfileHeader>
          <AvatarContainer>
            {user.username.charAt(0).toUpperCase()}
          </AvatarContainer>
          <Title>{user.username}</Title>
          <Email>{user.email}</Email>
        </ProfileHeader>

        <StatsGrid>
          <StatCard>
            <StatValue>{user.total_submissions}</StatValue>
            <StatLabel>Total Submissions</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{user.correct_submissions}</StatValue>
            <StatLabel>Correct Submissions</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{user.unique_questions_solved}</StatValue>
            <StatLabel>Questions Solved</StatLabel>
          </StatCard>
          <StatCard>
  <StatValue>{user.xp}</StatValue>
  <StatLabel>XP</StatLabel>
</StatCard>
        </StatsGrid>

        <InfoSection>
          <InfoRow>
            <InfoIcon><User size={20} /></InfoIcon>
            <InfoLabel>Username</InfoLabel>
            <InfoValue>{user.username}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoIcon><Mail size={20} /></InfoIcon>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoIcon><Target size={20} /></InfoIcon>
            <InfoLabel>Success Rate</InfoLabel>
            <InfoValue>
              {((user.correct_submissions / user.total_submissions) * 100 || 0).toFixed(1)}%
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoIcon><Award size={20} /></InfoIcon>
            <InfoLabel>Achievement Status</InfoLabel>
            <InfoValue>
              {user.questions_solved >= 10 ? 'Advanced' : 'Beginner'}
            </InfoValue>
          </InfoRow>
        </InfoSection>

        <LogoutButton onClick={handleLogout}>
          Sign Out
          <LogOut size={18} />
        </LogoutButton>
      </GlassCard>
    </PageContainer>
  );
}