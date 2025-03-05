
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { LogOut, Edit, Save, Loader2 } from "lucide-react";

// 🔹 Fade-in animation for a smooth UI effect
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// 🔹 Styled Components for Profile Page
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
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
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
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.25rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #60a5fa;
`;

const StatLabel = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem;
  background: ${props => props.primary ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
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
`;

const Message = styled.div`
  text-align: center;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  font-weight: 600;
  color: white;
  background: ${props => props.success ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"};
`;

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);


  const refreshAccessToken = async () => {
    try {
      const response = await fetch("https://sqlpremierleague-backend.onrender.com/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include" // ✅ Ensures cookies are sent & received
      });
  
      if (!response.ok) throw new Error("Failed to refresh token");
      return true; // ✅ Successfully refreshed token
    } catch (error) {
      console.error("Refresh token failed. Logging out.", error);
      // window.location.href = "/signin"; // Redirect to login
      return false;
    }
  };
  
  
  const fetchWithAuth = async (url, options = {}) => {
    
    const csrfToken = localStorage.getItem("csrf_token"); // Get CSRF token from localStorage
    if (!options.headers) {
      options.headers = {};
    }
  
    if (csrfToken) {
      options.headers["X-CSRF-Token"] = csrfToken; 
    }
    let response = await fetch(url, options);
    if (response.status === 401) {
      console.warn("Access token expired. Refreshing...");
  
      const refreshSuccess = await refreshAccessToken();
      if (!refreshSuccess) return null; // If refresh fails, log out the user
  
      response = await fetch(url, options); // Retry request after refreshing token
    }
  
    return response;
  };

  const fetchProfile = async () => {
    try {
      const response = await fetchWithAuth("https://sqlpremierleague-backend.onrender.com/profile", {
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
      setNewUsername(data.username);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message);
      navigate('/signin');
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(prev => !prev);
    setNewPassword(""); // Reset password field on toggle
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch("https://sqlpremierleague-backend.onrender.com/edit-profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: newUsername,
          password: newPassword.length > 0 ? newPassword : undefined
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setUser(prev => ({ ...prev, username: updatedData.username }));
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(`Error: ${error}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    setUpdating(true);
    try {
      await fetch("https://sqlpremierleague-backend.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshtoken");
      localStorage.removeItem("csrf_token");
      navigate('/signin');
    }
  };

  // ✅ Calculate Accuracy
  const accuracy = user?.total_submissions > 0 ? ((user.correct_submissions / user.total_submissions) * 100).toFixed(2) + "%" : "N/A";

  return (
    <PageContainer>
      <GlassCard>
        <ProfileHeader>
          <Title>{user?.username}</Title>
          <Email>{user?.email}</Email>
        </ProfileHeader>

        <StatsGrid>
          <StatCard><StatValue>{user?.total_submissions}</StatValue><StatLabel>Total Submissions</StatLabel></StatCard>
          <StatCard><StatValue>{user?.correct_submissions}</StatValue><StatLabel>Correct Submissions</StatLabel></StatCard>
          <StatCard><StatValue>{user?.unique_questions_solved}</StatValue><StatLabel>Questions Solved</StatLabel></StatCard>
          <StatCard><StatValue>{user?.xp}</StatValue><StatLabel>XP</StatLabel></StatCard>
          <StatCard><StatValue>{accuracy}</StatValue><StatLabel>Accuracy</StatLabel></StatCard>
        </StatsGrid>

        <ButtonGroup>
          <Button primary onClick={isEditing ? handleSave : handleEdit} disabled={updating}>
            {updating ? <Loader2 size={18} className="animate-spin" /> : isEditing ? <Save size={18} /> : <Edit size={18} />}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
          <Button onClick={handleLogout} disabled={updating}>
            <LogOut size={18} />
            Logout
          </Button>
        </ButtonGroup>
      </GlassCard>
    </PageContainer>
  );
}
