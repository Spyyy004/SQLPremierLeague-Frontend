

import React from "react"; 
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReactConfetti from 'react-confetti';
import MonacoEditor from "@monaco-editor/react";
import {AlertTriangle , LogIn,  CheckCircle, XCircle, ChevronDown, ChevronUp} from 'lucide-react';
import ReactGA from "react-ga4";

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
  height: 100vh;
  background: #1e1e2e;
  color: white;
  overflow: hidden; // Prevent page-level scroll
`;

const LeftPanel = styled.div`
  width: 45%;
  background: #1e1e2e;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

const RightPanel = styled.div`
  width: 55%;
  display: flex;
  flex-direction: column;
  background: #282a36;
`;

const Tabs = styled.div`
  display: flex;
  padding: 0.5rem 1rem;
  background: #282a36;
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

export default function ProblemPage() {
  const { id } = useParams();
  
  const storedQuery = localStorage.getItem(`query_${id}`) || "-- Write your SQL query here --";
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [problem, setProblem] = useState(null);
  const [tables, setTables] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [userCode, setUserCode] = useState(storedQuery);
  const [output, setOutput] = useState("");
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
  useEffect(() => {
    fetchProblem();
    fetchSubmissions();
    fetchCSRFToken();
    const savedQuery = localStorage.getItem(`query_${id}`);
    if (savedQuery) setUserCode(savedQuery);
    
  }, [id]); // ✅ Runs every time id changes



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
      window.location.href = "/signin"; // Redirect to login
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
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  };
  
  
  // ✅ Modified fetchSubmissions with refresh logic
  const fetchSubmissions = async () => {
    try {
      const response = await fetchWithAuth(`https://sqlpremierleague-backend.onrender.com/submissions?question_id=${id}`,{
        credentials : "include"
      });
  
      if (!response || !response.ok) throw new Error("Failed to fetch submissions");
  
      const data = await response.json();
      setSubmissions(data.submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
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
    // Redirect to login/signup page
    window.location.href = "/signin";
  };



  const handleRun = async (isSubmit = false) => {
    try {

      const allowedTables = ["deliveries", "matches"];
      const lowerCaseQuery = userCode.toLowerCase();
  
      // Check if the query contains only allowed tables
      const queryTables = lowerCaseQuery.match(/from\s+(\w+)/gi);
      if (queryTables) {
        for (const match of queryTables) {
          const tableName = match.split(" ")[1].trim();
          if (!allowedTables.includes(tableName)) {
            setError({ message: "Incorrect table query" });
            setSuccess(false);
            return;
          }
        }
      }

      if (isSubmit) {


        // Check if user is logged in before submitting
        const response = await fetchWithAuth(`https://sqlpremierleague-backend.onrender.com/protected`, {
          method: "GET",
          credentials: "include",
        });
  
        if (!response.ok) {
          // If not authenticated, show login popup
          setShowLoginPopup(true);
          return;
        }
      }
  
      setQueryResults(null);
      setError(null);
      setIsLoading(true);
      const endpoint = isSubmit ? 'submit-answer' : 'run-answer';
      const response = await fetchWithAuth(
        `https://sqlpremierleague-backend.onrender.com/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({ user_query: userCode, question_id: id, is_submit: isSubmit }),
          credentials: "include",
        }
      );
  
      const data = await response.json();
      
      if (response.status === 201 || response.status === 200) {
        setQueryResults({
          user_query_result: data.user_query_result || [],
          correct_query_result: data.correct_query_result || [],
          message: "Success",
        });
      setIsRepeatSubmission(data?.is_repeat)
      let xp = 0;
      if (questionType === "easy") xp = 50;
      else if (questionType === "medium") xp = 100;
      else if (questionType === "hard") xp = 200;

      setXpGained(xp);
        setSuccess(data.is_correct);
        setError(null);

        ReactGA.event({
          category: "User",
          action: "Ran SQL Query",
          label: `Problem ${id}`,
        });
  
        // ✅ Track if the query was correct or incorrect
        ReactGA.event({
          category: "Problem Solving",
          action: data.is_correct ? "Correct Submission" : "Incorrect Submission",
          label: `Problem ${id}`,
        });

        if (data.is_correct && isSubmit) {
          setShowConfetti(true);
          setShowSuccessPopup(true);
          setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
        }


      } else {
        setError({message : data?.error ?? "An error occured"});
        setSuccess(false);
        ReactGA.event({
          category: "Error",
          action: "Query Failed",
          label: `Problem ${id}`,
        });
      }
    } catch (error) {
      setQueryResults(null);
      setError({ message: "Error executing query." });
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const goToRandomQuestion = async () => {
    try {
      
      
        navigate(`/challenges/`);
      
    } catch (error) {
      console.error('Error fetching random question:', error);
    }
  };
  
  const renderResultTable = (data, title) => {
    if (!data || data.length === 0) return null;
    
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
  


  if (!problem) {
    return (
      <PageContainer>
        <div style={{ margin: 'auto', color: '#aaa' }}>Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <LeftPanel>
        <Tabs>
          <Tab 
            active={activeTab === "description"} 
            onClick={() => setActiveTab("description")}
          >
            Description
          </Tab>
          <Tab 
            active={activeTab === "submissions"} 
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </Tab>
          <Tab 
            active={activeTab === "discussions"} 
            onClick={() => setActiveTab("discussions")}
          >
            Discussions
          </Tab>
        </Tabs>

        <ContentArea>
          {activeTab === "description" && (
            <>
              <ProblemTitle>{problem.question}</ProblemTitle>
              <ProblemStatement>{problem.details}</ProblemStatement>
              {tables && (
                <div>
                  <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Database Schema</h3>
                  {Object.entries(tables).map(([tableName, tableData]) => (
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
            <div style={{ color: '#aaa' }}>Discuss this problem with other users.</div>
          )}
        </ContentArea>
      </LeftPanel>

      <RightPanel>
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
            <Button 
              onClick={() => handleRun(false)} 
              disabled={isLoading}
            >
              {isLoading ? 'Running...' : 'Run'}
            </Button>
            <Button 
              submit 
              onClick={() => handleRun(true)}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </ActionButtons>
          
          {!error && queryResults?.message && (
            <StatusMessage success={success}>
              {success ? "Correct Answer" : "Wrong Answer"}
            </StatusMessage>
          )}
        </ButtonContainer>

        {error && (
          <ErrorContainer>
            <ErrorHeader>
              <AlertTriangle size={18} />
              {error.message}
            </ErrorHeader>
            {error.details && (
              <ErrorDetails>{error.details}</ErrorDetails>
            )}
          </ErrorContainer>
        )}

        {!error && queryResults && (
          <ResultsContainer>
            {renderResultTable(queryResults.user_query_result, "Your Query Result")}
            {renderResultTable(queryResults.correct_query_result, "Expected Result")}
          </ResultsContainer>
        )}
      </RightPanel>
{showLoginPopup && (
  <PopupOverlay>
    <Popup>
      <LogIn size={40} color="#60a5fa" />
      <h3 style={{ color: "#fff", marginBottom: "1rem" }}>Login Required</h3>
      <p style={{ color: "#bbb" }}>You need to log in to submit your answer.</p>
      <CloseButton onClick={handleLogin}>Go to Login</CloseButton>
    </Popup>
  </PopupOverlay>
)}

{showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

{showSuccessPopup && !isRepeatSubmission && (
  <PopupOverlay>
    <SuccessPopup>
      <AlertTriangle size={48} color="#22c55e" />
      <CelebrationTitle>Congratulations! 🎉</CelebrationTitle>
      <CelebrationText>
        Great job solving this challenge! You earned <strong>{xpGained} XP</strong>! 💪
      </CelebrationText>
      <NextChallengeButton onClick={goToRandomQuestion}>
        Try Next Challenge
      </NextChallengeButton>
    </SuccessPopup>
  </PopupOverlay>
)}

    </PageContainer>
  );
}

