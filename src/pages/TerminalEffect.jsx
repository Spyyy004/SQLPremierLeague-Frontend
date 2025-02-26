import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TerminalContainer = styled.div`
  margin: 20px 0;
  text-align: center;
`;

const TerminalWindow = styled.div`
  background: #1e1e1e;
  padding: 10px 20px;
  border-radius: 5px;
  display: inline-block;
  min-width: 80%;
  font-family: 'Consolas', 'Monaco', monospace;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

const TerminalHeader = styled.div`
  background: #333;
  margin: -10px -20px 10px;
  padding: 8px 12px;
  border-radius: 5px 5px 0 0;
  display: flex;
  align-items: center;
`;

const TerminalDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
  background-color: ${props => props.color};
`;

const TerminalTitle = styled.div`
  color: #aaa;
  font-size: 0.9rem;
  margin: 0 auto;
`;

const TerminalPrompt = styled.div`
  color: #63b3ed;
  display: inline;
`;

const TerminalText = styled.span`
  color: #48bb78;
  margin-left: 5px;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: #ffffff;
  margin-left: 2px;
  opacity: ${props => (props.visible ? 1 : 0)};
  animation: ${props => (props.visible ? 'blink 1s step-end infinite' : 'none')};
  
  @keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const TerminalEffect = () => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);

  // SQL commands to cycle through
  const sqlCommands = [
    // Football query: Get top 10 football players by goals
    "SELECT player_name, goals FROM football_players ORDER BY goals DESC LIMIT 10;",
    
    // Basketball query: Update wins for a specific basketball team
    "UPDATE basketball_teams SET wins = wins + 1 WHERE team_name = 'Los Angeles Lakers';",
    
    // Cricket query: Count wins for each cricket team
    "SELECT team_name, COUNT(*) AS wins FROM cricket_matches WHERE is_winner = true GROUP BY team_name;",
    
    // Baseball query: Get top 5 hitters by total hits using a CTE
  ];

  useEffect(() => {
    let timeout;
    
    if (isTyping) {
      // Typing effect
      const currentCommand = sqlCommands[currentCommandIndex];
      if (text.length < currentCommand.length) {
        timeout = setTimeout(() => {
          setText(currentCommand.substring(0, text.length + 1));
        }, Math.random() * 50 + 50); // Random delay for realistic typing
      } else {
        // Pause before starting to delete
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    } else {
      // Backspacing effect
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(text.substring(0, text.length - 1));
        }, Math.random() * 30 + 30);
      } else {
        // Move to next command and start typing again
        setCurrentCommandIndex((currentCommandIndex + 1) % sqlCommands.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isTyping, currentCommandIndex]);

  return (
    <TerminalContainer>
      <TerminalWindow>
        <TerminalHeader>
          <TerminalDot color="#ff5f56" />
          <TerminalDot color="#ffbd2e" />
          <TerminalDot color="#27c93f" />
          <TerminalTitle></TerminalTitle>
        </TerminalHeader>
        <TerminalPrompt>sql&gt;</TerminalPrompt>
        <TerminalText>{text}</TerminalText>
        <Cursor visible={isTyping} />
      </TerminalWindow>
    </TerminalContainer>
  );
};

export default TerminalEffect;