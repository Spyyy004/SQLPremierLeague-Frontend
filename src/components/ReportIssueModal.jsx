import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: #1e1e2e;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  color: #fff;
  margin-bottom: 1rem;
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  resize: none;
`;

const Button = styled.button`
  background: #60a5fa;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #3b82f6;
  }
`;

const ReportIssueModal = ({ isOpen, onClose }) => {
  const [issueType, setIssueType] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = async () => {
    // Handle the submission logic here
    console.log('Issue Type:', issueType);
    console.log('Comments:', comments);

    try {
      const response = await fetch('https://sqlpremierleague-backend.onrender.com/report-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your_valid_jwt_token', // Add your JWT token here
        },
        body: JSON.stringify({
          issue_reported: issueType, // Adjusted to match the expected request body
          comments: comments,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error reporting issue:', error);
    }

    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <Title>Report an Issue</Title>
        <Dropdown value={issueType} onChange={(e) => setIssueType(e.target.value)}>
          <option value="">Select an issue</option>
          <option value="unable to run code">Unable to run code</option>
          <option value="unable to submit code">Unable to submit code</option>
          <option value="incorrect final answer by system">Incorrect final answer by system</option>
          <option value="other">Other</option>
        </Dropdown>
        <TextArea
          rows="4"
          placeholder="Additional comments..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
        <Button onClick={onClose} style={{ background: 'red', marginLeft: '0.5rem' }}>Cancel</Button>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ReportIssueModal; 