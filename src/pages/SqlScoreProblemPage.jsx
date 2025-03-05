import React from "react"; 
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReactConfetti from 'react-confetti';
import MonacoEditor from "@monaco-editor/react";
import {AlertTriangle , LogIn,  CheckCircle, XCircle, ChevronDown, ChevronUp, Clock} from 'lucide-react';
import ReactGA from "react-ga4";
import Mixpanel
 from "../utils/mixpanel";
import DiscussionsTab from "../components/DiscussionsTab";
import { v4 as uuidv4 } from 'uuid';

const SubmissionsContainer = styled.div`
  padding: 1rem;
  overflow-y: auto;
  max-height: 500px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const TableHead = styled.thead`
  background: #282a36;
  color: #60a5fa;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: ${({ index }) => (index % 2 === 0 ? "#1e1e2e" : "#232435")};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 12px;
  text-align: left;
  color: #ddd;
`;

const StatusIcon = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ correct }) => (correct ? "#22c55e" : "#ef4444")};
`;

const ToggleQueryButton = styled.button`
  background: none;
  border: none;
  color: #60a5fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;

  &:hover {
    color: #3b82f6;
  }
`;

const QueryBox = styled.pre`
  background: #15151f;
  color: #bbb;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.85rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 5px;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1e1e2e;
  color: white;
  overflow: hidden;
`;

const MainHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: rgba(30, 30, 46, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PanelsContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  width: 45%;
  background: #1e1e2e;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    height: 50vh;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const RightPanel = styled.div`
  width: 55%;
  display: flex;
  flex-direction: column;
  background: #282a36;
  margin-bottom:10%;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    height: 50vh;
  }
`;

const Tabs = styled.div`
  display: flex;
  padding: 0.5rem 1rem;

  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? '#1e1e2e' : 'transparent'};
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  color: ${props => props.active ? '#60a5fa' : '#aaa'};
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 0.5rem;

  &:hover {
    color: white;
    background: ${props => props.active ? '#1e1e2e' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e2e;
  }

  &::-webkit-scrollbar-thumb {
    background: #404040;
    border-radius: 4px;
  }
`;

const ProblemTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #fff;
`;

const ProblemStatement = styled.p`
  font-size: 0.95rem;
  color: #bbb;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ErrorContainer = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem;
  color: #ef4444;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ErrorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const ErrorDetails = styled.pre`
  font-family: monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #ff9999;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;

const StatusMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  color: ${props => props.success ? '#22c55e' : '#ef4444'};
  background: ${props => props.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border-radius: 4px;
`;

const SchemaSection = styled.div`
max-width: 100%; /* Prevents overflowing */
overflow-x: auto; /* Enables horizontal scrolling if needed */
white-space: nowrap; /* Prevents table columns from wrapping */
display: block; /* Ensures it contains its children properly */
padding: 1rem; /* Adds some spacing */
`;

const TableName = styled.h4`
  color: #60a5fa;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const SchemaTable = styled.table`
max-width: 100%; /* Ensure it fits within the left panel */
overflow-x: auto; /* Enable horizontal scroll if needed */
white-space: nowrap; 

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #444;
}

table {
  width: auto; /* Prevents table from taking full width */
  border-collapse: collapse;
}
`;

const EditorContainer = styled.div`
  flex: 1;
  min-height: 0; // Important for flex child
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #1e1e2e;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  background: ${props => props.submit ? '#60a5fa' : '#22c55e'};
  color: white;

  &:hover {
    background: ${props => props.submit ? '#3b82f6' : '#16a34a'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const OutputContainer = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-family: monospace;
  color: ${props => props.success ? '#22c55e' : '#ef4444'};
`;

const ResultsContainer = styled.div`
  padding: 1rem;
  background: #1e1e2e;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 300px;
  overflow-y: auto;
`;

const ResultSection = styled.div`
  margin-bottom: 1rem;
`;

const ResultTitle = styled.h3`
  font-size: 1rem;
  color: ${props => props.success ? '#22c55e' : '#ef4444'};
  margin-bottom: 0.5rem;
`;

const ResultTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
  font-size: 0.9rem;

  th, td {
    padding: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: left;
  }

  th {
    background: #282a36;
    color: #60a5fa;
  }

  td {
    color: #bbb;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Popup = styled.div`
  background: #1e1e2e;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  width: 300px;
`;

const CloseButton = styled.button`
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: #ef4444;
  border: none;
  color: white;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const ExecutionTime = styled.p`
  margin-top: 10px;
  color: #10b981;
  font-size: 0.9rem;
  font-weight: 500;
`;

const SuccessPopup = styled(Popup)`
  background: #1e1e2e;
  padding: 2.5rem;
  border-radius: 12px;
  text-align: center;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const CelebrationTitle = styled.h2`
  color: #22c55e;
  font-size: 1.5rem;
  margin: 1rem 0;
`;

const CelebrationText = styled.p`
  color: #bbb;
  margin-bottom: 1.5rem;
`;

const NextChallengeButton = styled(Button)`
  background: #22c55e;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;

  &:hover {
    background: #16a34a;
  }
`;

// New styled components for enhanced UI
const TimerHeader = styled.div`
  padding: 1rem;
  background: rgba(40, 42, 54, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TimerDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => {
    if (props.timeLeft < 30) return '#ef4444'; // Red for < 30 seconds
    if (props.timeLeft < 120) return '#eab308'; // Yellow for < 2 minutes
    return '#60a5fa'; // Blue for normal
  }};
  animation: ${props => props.timeLeft < 60 ? 'pulse 2s infinite' : 'none'};

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #60a5fa;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const FeedbackMessage = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  border-radius: 8px;
  background: ${props => props.success ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
  color: white;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
  z-index: 100;

  @keyframes slideDown {
    from { transform: translate(-50%, -20px); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
`;

const ErrorSolution = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 0.9rem;
  color: #bbb;
`;

const RetryButton = styled(Button)`
  margin-top: 1rem;
  background: #ef4444;
  &:hover { background: #dc2626; }
`;

const SessionWarning = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(234, 179, 8, 0.9);
  padding: 1rem;
  border-radius: 8px;
  color: white;
  animation: fadeIn 0.3s ease-out;
  z-index: 100;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// Add these styled components
const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #60a5fa;

  span:nth-child(2) {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const QuestionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
`;

const DifficultyBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.type?.toLowerCase()) {
      case 'easy': return 'rgba(34, 197, 94, 0.2)';
      case 'medium': return 'rgba(234, 179, 8, 0.2)';
      case 'hard': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.type?.toLowerCase()) {
      case 'easy': return '#22c55e';
      case 'medium': return '#eab308';
      case 'hard': return '#ef4444';
      default: return '#fff';
    }
  }};
`;

const CategoryBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(96, 165, 250, 0.2);
  color: #60a5fa;
`;

const TimerBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.timeLeft < 30 ? '#ef4444' : props.timeLeft < 120 ? '#eab308' : '#fff'};
`;

const LoadingText = styled.div`
  color: #60a5fa;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const ScoreHeader = styled.div`
  padding: 1rem;
  background: rgba(30, 30, 46, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ResultModal = styled.div`
  background: #1e1e2e;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const BadgeDisplay = styled.div`
  font-size: 2rem;
  text-align: center;
  margin: 1rem 0;
  color: #60a5fa;
`;

const ScoreText = styled.div`
  font-size: 1.5rem;
  text-align: center;
  color: #fff;
  margin: 1rem 0;
`;

function SubmissionsTab({ submissions }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleQuery = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SubmissionsContainer>
      <Table>
        <TableHead>
          <tr>
            <th style={{ padding: "10px", textAlign: "left" }}>Problem</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Time</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Query</th>
          </tr>
        </TableHead>
        <tbody>
          {submissions.map((submission, index) => (
            <React.Fragment key={index}>
              <TableRow index={index}>
                <TableCell>{submission[1]}</TableCell>
                <TableCell>
                  <StatusIcon correct={submission[3]}>
                    {submission[3] ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {submission[3] ? "Correct" : "Incorrect"}
                  </StatusIcon>
                </TableCell>
                <TableCell>{new Date(submission[4]).toLocaleString()}</TableCell>
                <TableCell>
                  <ToggleQueryButton onClick={() => toggleQuery(index)}>
                    {expandedIndex === index ? "Hide Query" : "View Query"}
                    {expandedIndex === index ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </ToggleQueryButton>
                </TableCell>
              </TableRow>
              {expandedIndex === index && (
                <tr>
                  <td colSpan="4">
                    <QueryBox>{submission[2]}</QueryBox>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </SubmissionsContainer>
  );
}

export default function SQLTestProblemPage() {
  const { id } = useParams();
  
  const storedQuery = localStorage.getItem(`query_${id}`) || "-- Write your SQL query here --";
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [problem, setProblem] = useState(null);
  const [tables, setTables] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [userCode, setUserCode] = useState(storedQuery);
  const [output, setOutput] = useState("");
  const [executionTime, setExecutionTime] = useState(null);
  const [expectedExecutionTime, setExpectedExecutionTime] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queryResults, setQueryResults] = useState(null);
  const [error, setError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isRepeatSubmission, setIsRepeatSubmission] = useState(true);
  const [xpGained, setXpGained] = useState(0);
const [questionType, setQuestionType] = useState(""); 
  const navigate = useNavigate()
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    question: null,
    details: null,
    tables: null
  });
  const [testScore, setTestScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [testId] = useState(uuidv4());
  const [showResultModal, setShowResultModal] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 5 minutes in seconds
  const [testSessionId, setTestSessionId] = useState(null);

  // Update the initial useEffect
  useEffect(() => {
    const checkAndResumeTest = async () => {
      const savedTestSessionId = localStorage.getItem("test_session_id");
      const savedTestScore = localStorage.getItem("test_score");
      const savedCorrectAnswers = localStorage.getItem("correct_answers");
      const savedTimeLeft = localStorage.getItem("time_left");
      
      if (savedTestSessionId) {
        try {
          // Call start-test with the existing session ID
          const response = await fetch("https://sqlpremierleague-backend.onrender.com/start-test", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify({
              test_session_id: savedTestSessionId // Pass the existing session ID
            })
          });

          const data = await response.json();
          if (data.questions && data.questions.length > 0) {
            const firstQuestion = data.questions[0];
            
            // Resume the test state
            setTestSessionId(savedTestSessionId);
            setTestScore(parseInt(savedTestScore) || 0);
            setCorrectAnswers(parseInt(savedCorrectAnswers) || 0);
            setTimeLeft(parseInt(savedTimeLeft) || 120);
            setTestStarted(true);

            // Set the current question
            setCurrentQuestion({
              id: firstQuestion.id,
              question: firstQuestion.question,
              details: firstQuestion.correct_query,
              tables: firstQuestion.tables,
              category: firstQuestion.category,
              type: firstQuestion.type
            });
          }
        } catch (error) {
          console.error("Error resuming test:", error);
          // If there's an error, clean up the invalid session
          
          localStorage.removeItem("test_score");
          localStorage.removeItem("correct_answers");
          localStorage.removeItem("time_left");
        }
      }
      else{
        startTest()
      }
    };

    checkAndResumeTest();
  }, []);

  // Update your timer useEffect to save remaining time
  useEffect(() => {
    if (!testStarted) return;

    // Save time left to localStorage
    localStorage.setItem("time_left", timeLeft.toString());

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTestEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeLeft]);

  const sendMixpanelEvent = (problem) => {
    Mixpanel
    .track('Problem Page Viewed', problem)
  }
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
  

  const handleCodeChange = (value) => {
    setUserCode(value);
    localStorage.setItem(`query_${id}`, value); // Save for specific problem
  };
  
  // ✅ Modified fetchProblem with refresh logic
  const fetchProblem = async () => {
    try {
      const response = await fetchWithAuth(`https://sqlpremierleague-backend.onrender.com/problem/${id}`);
  
      if (!response || !response.ok) throw new Error("Failed to fetch problem");
      
      const data = await response.json();
      setQuestionType(data?.problem?.type)
      setProblem(data.problem);
      setTables(data.tables);
      sendMixpanelEvent(data?.problem);
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  };
  
  
  
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch("https://sqlpremierleague-backend.onrender.com/csrf-token", {
        method: "GET",
        credentials: "include"  // 🔥 Important: Ensures cookies are sent
      });
      
      const data = await response.json();
      if (data.csrf_token) {
        localStorage.setItem("csrf_token", data.csrf_token);  // ✅ Store CSRF token
      }
    } catch (err) {
      console.error("CSRF Token Fetch Error:", err.message);
    }
  };
  

  const handleLogin = () => {
   
    navigate("/signin", { state: { from: location.pathname } });
  };



  const handleRun = async (isSubmit) => {
    // Add Mixpanel event for running a query
    Mixpanel.track('Query Run', { isSubmit });

    setIsLoading(true);
    setFeedback(null);

    const questionId = parseInt(currentQuestion.id);
    if (!questionId || isNaN(questionId)) {
      console.error("Invalid question ID:", currentQuestion.id);
      return;
    }

    const cleanedQuery = userCode.trim();
    if (!cleanedQuery || cleanedQuery === "-- Write your SQL query here --") {
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      
      // Use different endpoints for run vs submit
      const endpoint = isSubmit ? "submit-test-answer" : "run-answer";
      const testSessionId = localStorage.getItem("test_session_id");
      
      const requestBody = isSubmit ? {
        test_session_id: testSessionId,
        question_id: questionId,
        user_query: cleanedQuery
      } : {
        user_query: cleanedQuery,
        question_id: questionId,
        is_submit: false
      };

      const response = await fetch(`https://sqlpremierleague-backend.onrender.com/${endpoint}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute query');
      }
      
     
      
      // If this was a submit action and the answer was correct, fetch next question
      if (isSubmit) {
        setQueryResults({
          user_query_result: data.user_result,
          correct_query_result: data.correct_result,
          message: data.is_correct ? "Correct Answer!" : "Wrong Answer",
          execution_time: {
            user: data.user_execution_time,
            correct: data.correct_execution_time
          }
        });
        await fetchNextQuestion(data.is_correct);
        
        // Update scores if correct
        if (data.is_correct) {
          const newScore = testScore + 10;
          const newCorrectAnswers = correctAnswers + 1;
          
          // Save updated scores
          localStorage.setItem("test_score", newScore.toString());
          localStorage.setItem("correct_answers", newCorrectAnswers.toString());
          
          setTestScore(newScore);
          setCorrectAnswers(newCorrectAnswers);
        }
      }
      else{
        setQueryResults({
          user_query_result: data.user_query_result,
          correct_query_result: data.correct_query_result,
          message: data.is_correct ? "Correct Answer!" : "Wrong Answer",
          execution_time: {
            user: data.user_execution_time,
            correct: data.correct_execution_time
          }
        });
      }

      if (data.is_correct) {
        setFeedback({ type: 'success', message: 'Correct Answer!' });
      } else {
        setFeedback({ type: 'error', message: 'Incorrect Answer!' });
      }
    } catch (error) {
      console.error("Error executing query:", error);
      setQueryResults({
        error: error.message,
        user_query_result: [],
        correct_query_result: []
      });
      setFeedback({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const goToRandomQuestion = async () => {
    try {
        navigate(`/challenges?category=${problem?.category}`);
    } catch (error) {
      console.error('Error fetching random question:', error);
    }
  };
  
  const renderResultTable = (data, title) => {
    if (!data || data.length === 0) return null;
    
    // Track when results are displayed
    Mixpanel.track('Results Displayed', { title });

    return (
      <ResultSection>
        <ResultTitle success={title === "Expected Result"}>{title}</ResultTitle>
        <ResultTable>
          <thead>
            <tr>
              {Array.from({ length: data[0].length }).map((_, i) => (
                <th key={i}>Column {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell?.toString() ?? "NULL"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </ResultTable>
      </ResultSection>
    );
  };
  
  const startTest = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch("https://sqlpremierleague-backend.onrender.com/start-test", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        const firstQuestion = data.questions[0];
        const questionId = parseInt(firstQuestion.id);
        
        if (!questionId || isNaN(questionId)) {
          throw new Error("Invalid question ID received from server");
        }

        // Store the test session ID
        localStorage.setItem("test_session_id", data.test_session_id);

        // Update the current question with the new structure
        setCurrentQuestion({
          id: questionId,
          question: firstQuestion.question,
          details: firstQuestion.correct_query, // Note: You might want to hide this in production
          tables: firstQuestion.tables,
          category: firstQuestion.category,
          type: firstQuestion.type
        });
        setTestStarted(true);
      }
    } catch (error) {
      console.error("Error starting test:", error);
    }
  };

  const fetchNextQuestion = async (wasCorrect) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const testId = localStorage.getItem("test_session_id"); // Using test_session_id as test_id

      const response = await fetch("https://sqlpremierleague-backend.onrender.com/next-question", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          test_id: testId,
          correct: wasCorrect,
          score: testScore + (wasCorrect ? 10 : 0),
          correct_answers: correctAnswers + (wasCorrect ? 1 : 0)
        }),
      });

      const data = await response.json();
      
      if (data.questions && data.questions.length > 0) {
        const nextQuestion = data.questions[0];
        const questionId = parseInt(nextQuestion.id);

        if (!questionId || isNaN(questionId)) {
          throw new Error("Invalid question ID received from server");
        }

        // Store the new test_id if it's different
        if (data.test_id && data.test_id !== testId) {
          localStorage.setItem("test_session_id", data.test_id);
        }

        setCurrentQuestion({
          id: questionId,
          question: nextQuestion.question,
          details: nextQuestion.correct_query, // Note: You might want to hide this in production
          tables: nextQuestion.tables,
          category: nextQuestion.category,
          type: nextQuestion.type
        });
        setQueryResults(null);
        setUserCode("-- Write your SQL query here --");
      } 
    } catch (error) {
      console.error("Error fetching next question:", error);
    }
  };

  const handleTestEnd = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const testSessionId = localStorage.getItem("test_session_id");

      const response = await fetch("https://sqlpremierleague-backend.onrender.com//end-test", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test_session_id: testSessionId
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to end test');
      }

      // Check if the user is logged in
      if (data.test_summary && data.user_id) {
        // Navigate to the sql-test-result page and pass the data
        navigate('/sql-test-result', { state: { 
          test_summary: data.test_summary,
          question_details: data.question_details
        }});
      } else {
        // Show the modal for logged-out users
        data.features = [
          "Detailed Results",
          "Leaderboard Access",
          "Progressive Learnings"
        ]
        setTestResult(data);
        setShowResultModal(true);
      }
      
      
      setTestStarted(false);
      setTestSessionId(null);
    } catch (error) {
      console.error("Error ending test:", error);
      // Optionally show error to user
      setFeedback({
        type: 'error',
        message: 'Failed to end test. Please try again.'
      });
    }
    finally{
      localStorage.removeItem("test_score");
      localStorage.removeItem("correct_answers");
      localStorage.removeItem("time_left");
    }
  };

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timer on unmount or feedback change
    }
  }, [feedback]);

  const closeModal = () => {
    setShowResultModal(false);
    navigate("/"); // or wherever you want to redirect after the test
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Add these new functions
  const claimTest = async (testSessionId) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:5000/claim-test/${testSessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const data = await response.json();
      if (data.message === "Test session claimed successfully") {
        return data.test_session_id;
      }
      return null;
    } catch (error) {
      console.error("Error claiming test:", error);
      return null;
    }
  };

  const fetchTestReport = async (testSessionId) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:5000/test-report/${testSessionId}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching test report:", error);
      return null;
    }
  };



  if (!currentQuestion.id) {
    return (
      <PageContainer>
        <div style={{ margin: 'auto', color: '#aaa' }}>Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <MainHeader>
        <TimerDisplay timeLeft={timeLeft}>
          <Clock size={20} />
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </TimerDisplay>
      </MainHeader>

      {feedback && (
        <FeedbackMessage success={feedback.type === 'success'}>
          {feedback.message}
        </FeedbackMessage>
      )}

      {sessionWarning && (
        <SessionWarning>
          <AlertTriangle size={20} />
          Your session will expire soon. Please complete the test.
        </SessionWarning>
      )}

      <PanelsContainer>
        <LeftPanel>
          <ScoreHeader>
            <ScoreDisplay>
              <span>Score: {testScore}</span>
              <span>•</span>
              <span>Correct: {correctAnswers}</span>
            </ScoreDisplay>
          </ScoreHeader>
          <Tabs>
            <Tab 
              active={activeTab === "description"} 
              onClick={() => setActiveTab("description")}
            >
              Description
            </Tab>
           
          </Tabs>

          <ContentArea>
            {activeTab === "description" && (
              <>
                <QuestionInfo>
                  <DifficultyBadge type={currentQuestion.type}>
                    {currentQuestion.type}
                  </DifficultyBadge>
                  <CategoryBadge>
                    {currentQuestion.category}
                  </CategoryBadge>
                </QuestionInfo>
                <ProblemTitle>{currentQuestion.question}</ProblemTitle>
                {currentQuestion.tables && (
                  <div>
                    <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Database Schema</h3>
                    {Object.entries(currentQuestion.tables).map(([tableName, tableData]) => (
                      <SchemaSection key={tableName}>
                        <TableName>{tableName}</TableName>
                        
                        <SchemaTable>
                          <thead>
                            <tr>
                              {tableData.columns.map(col => (
                                <th key={col}>{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.sample_data.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((value, colIndex) => (
                                  <td key={colIndex}>{value}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </SchemaTable>
                      </SchemaSection>
                    ))}
                  </div>
                )}
              </>
            )}
            {activeTab === "submissions" && <SubmissionsTab submissions={submissions} />}
            {activeTab === "discussions" && (
              <DiscussionsTab questionId = {id}/>
            )}
          </ContentArea>
        </LeftPanel>

        <RightPanel>
          {isLoading && (
            <LoadingOverlay>
              <div style={{ textAlign: 'center' }}>
                <LoadingSpinner />
                <LoadingText>Executing Query...</LoadingText>
              </div>
            </LoadingOverlay>
          )}

          <EditorContainer>
            <MonacoEditor
              height="100%"
              defaultLanguage="sql"
              value={userCode}
              theme="vs-dark"
              onChange={value => handleCodeChange(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 1.5,
                padding: { top: 10 }
              }}
            />
          </EditorContainer>

          <ButtonContainer>
            <ActionButtons>
              <Button onClick={() => handleRun(false)}>
                Run
              </Button>
              <Button submit onClick={() => handleRun(true)}>
                Submit
              </Button>
            </ActionButtons>
          </ButtonContainer>

          {queryResults?.error && (
            <ErrorContainer>
              <ErrorHeader>
                <AlertTriangle size={16} />
                Error in your query
              </ErrorHeader>
              <ErrorDetails>{queryResults.error}</ErrorDetails>
              <ErrorSolution>
                Tip: Check your syntax and make sure all referenced tables exist.
              </ErrorSolution>
              <RetryButton onClick={() => handleRun(false)}>
                Try Again
              </RetryButton>
            </ErrorContainer>
          )}

          {queryResults?.user_query_result && (
            <ResultsContainer>
              {renderResultTable(queryResults.user_query_result, "Your Query Result")}
              {renderResultTable(queryResults.correct_query_result, "Expected Result")}
              {executionTime !== null && (
        <ExecutionTime>
          ⏱️ Your Query: <strong>{executionTime} ms</strong> | Expected: <strong>{expectedExecutionTime} ms</strong>
        </ExecutionTime>
      )}
            </ResultsContainer>
          )}
        </RightPanel>
      </PanelsContainer>


{showResultModal && testResult && (
  <ModalOverlay>
    <ResultModal>
      <h2 style={{ color: '#fff', marginBottom: '1rem' }}>
        Test Complete!
      </h2>

      {testResult.isLoggedIn ? (
        <>
          <BadgeDisplay>
            {testResult.badge} 🏆
          </BadgeDisplay>
          
          <ScoreText>
            Final Score: {testResult.score}
          </ScoreText>
          
          <div style={{ color: '#bbb', marginTop: '1rem' }}>
            <p>Accuracy: {testResult.accuracy.toFixed(1)}%</p>
            <p>Correct Answers: {testResult.correctAnswers}/{testResult.totalQuestions}</p>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>Question Details</h3>
            {testResult.questionDetails.map((q, index) => (
              <div key={index} style={{ 
                padding: '0.5rem', 
                margin: '0.5rem 0',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px'
              }}>
                <p style={{ color: '#fff', fontSize: '0.9rem' }}>{q.question_text}</p>
                <p style={{ 
                  color: q.is_correct ? '#22c55e' : '#ef4444',
                  fontSize: '0.8rem',
                  marginTop: '0.3rem'
                }}>
                  {q.is_correct ? '✓ Correct' : '✗ Incorrect'} • {q.execution_time.toFixed(2)}ms
                </p>
                <p style={{ color: '#60a5fa', fontSize: '0.8rem' }}>
                  {q.category} • {q.type}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>{testResult.message}</h3>
          <ul style={{ 
            color: '#bbb',
            textAlign: 'left',
            marginBottom: '1.5rem',
            listStyle: 'none'
          }}>
            {testResult.features.map((feature, index) => (
              <li key={index} style={{ margin: '0.5rem 0' }}>
                ✨ {feature}
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button 
              onClick={() => navigate("/signin", { state: { from: location.pathname } })}
              style={{ background: '#60a5fa' }}
            >
              Sign In 
            </Button>
          </div>
        </div>
      )}

    </ResultModal>
  </ModalOverlay>
)}

    </PageContainer>
  );
}

