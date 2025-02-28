import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Star } from "lucide-react";
import Mixpanel from "../utils/mixpanel";
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

export default function ChallengeOfTheDay() {
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    // ✅ Step 1: Check Local Storage for existing challenge
    const storedChallenge = localStorage.getItem("challengeOfTheDay");
    const storedDate = localStorage.getItem("challengeDate");
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    if (storedChallenge && storedDate === today) {
      // ✅ Use cached challenge if it's from today
      setChallenge(JSON.parse(storedChallenge));
    } else {
      // ✅ Fetch new challenge if no valid cache
      fetch("https://sqlpremierleague-backend.onrender.com/challenge-of-the-day")
        .then(response => response.json())
        .then(data => {
          setChallenge(data);
          // ✅ Store challenge & date in local storage
          localStorage.setItem("challengeOfTheDay", JSON.stringify(data));
          localStorage.setItem("challengeDate", today);
        })
        .catch(error => console.error("Error fetching challenge:", error));
    }
  }, []);

  const handleClick = () => {
    if (challenge) {
      Mixpanel.track("Challenge of the Day Clicked", {
        challenge_id: challenge.id,
        question: challenge.question,
        category: challenge.category,
      });
    }
  };

  if (!challenge) return null;

  return (
    <Link to={`/solve/${challenge.id}`} style={{ textDecoration: "none" }} onClick={handleClick}>
      <Card>
        <Star size={32} color="#f8fafc" />
        <h2>Challenge of the Day</h2>
      </Card>
    </Link>
  );
}
