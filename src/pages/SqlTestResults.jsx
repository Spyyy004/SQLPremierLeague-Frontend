import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Mixpanel from '../utils/mixpanel';
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #13151a 0%, #1e2028 100%);
  color: #e1e2e5;
  padding: 2rem;
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: #60a5fa;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: #94a3b8;
  margin-bottom: 2rem;
`;

const Summary = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const SummaryItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  margin: 0 0.5rem;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Badge = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #60a5fa;
  margin-top: 1rem;
`;

const QuestionList = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const QuestionItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 0.5rem 0;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }
`;

const QuestionText = styled.p`
  font-size: 1.1rem;
  color: #e1e2e5;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const UserQueryContainer = styled.div`
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.75rem;
  font-family: 'Courier New', Courier, monospace;
  color: #e1e2e5;
  position: relative;
`;

const UserQueryLabel = styled.span`
  position: absolute;
  top: -10px;
  left: 10px;
  background: #1e2028;
  padding: 0 5px;
  font-size: 0.8rem;
  color: #60a5fa;
`;

const ResultText = styled.p`
  font-size: 0.9rem;
  color: ${props => (props.isCorrect ? '#22c55e' : '#ef4444')};
`;

const FeedbackMessage = styled.div`
  background-color: ${props => (props.success ? '#22c55e' : '#ef4444')};
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  transition: opacity 0.5s ease;
`;

const SqlTestResults = () => {
  const location = useLocation();
 
  const [testSummary, setTestSummary] = useState(null);
  const [questionDetails, setQuestionDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const test_session_id =  localStorage.getItem("test_session_id")|| '';
        console.log(test_session_id, 'akkwksd')
        // Claim the test session
        const claimResponse = await fetch(`https://sqlpremierleague-backend.onrender.com/claim-test/${test_session_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({}),
          credentials: 'include'
        });

        // Fetch the test report
        const reportResponse = await fetch(`https://sqlpremierleague-backend.onrender.com/test-report/${test_session_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (!reportResponse.ok) {
          throw new Error('Failed to fetch test report');
        }
        Mixpanel.track('Fetch Test Results Successful', { test_session_id });
        const reportData = await reportResponse.json();
        setTestSummary(reportData.test_summary);
        setQuestionDetails(reportData.question_details);
        setFeedback({ success: true, message: 'Test results fetched successfully!' });
      } catch (err) {
        setError(err.message);
        setFeedback({ success: false, message: 'Error fetching test results.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    
  }, []);

  // Automatically hide feedback after 2 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timer on unmount or feedback change
    }
  }, [feedback]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <PageContainer>
      {feedback && (
        <FeedbackMessage success={feedback.success}>
          {feedback.message}
        </FeedbackMessage>
      )}
      <ResultCard>
        <Title>Test Results</Title>
        <Subtitle>Here are your results for the SQL test</Subtitle>
        <Summary>
          <SummaryItem>
            <h3>Score</h3>
            <p>{testSummary?.score}%</p>
          </SummaryItem>
          <SummaryItem>
            <h3>Correct Answers</h3>
            <p>{testSummary?.correct_answers}/{testSummary?.total_questions}</p>
          </SummaryItem>
          <SummaryItem>
            <h3>Badge</h3>
            <Badge>{testSummary?.badge}</Badge>
          </SummaryItem>
        </Summary>
      </ResultCard>

      <QuestionList>
        {questionDetails.map((question, index) => (
          <QuestionItem key={index}>
            <QuestionText>{question.question_text}</QuestionText>
            <UserQueryContainer>
              <UserQueryLabel>Your Query:</UserQueryLabel>
              {question.user_query}
            </UserQueryContainer>
            <ResultText isCorrect={question.is_correct}>
              {question.is_correct ? '✓ Correct' : '✗ Incorrect'} - Execution Time: {question.execution_time} ms
            </ResultText>
          </QuestionItem>
        ))}
      </QuestionList>
    </PageContainer>
  );
};

export default SqlTestResults;


