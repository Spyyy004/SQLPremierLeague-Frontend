import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MessageSquare, ThumbsUp, Send, Trash2, Edit, Check, X } from "lucide-react";

// 🔹 Styled Components
const Container = styled.div`
  padding: 1rem;
  background: #1e1e2e;
  color: white;
`;

const CommentBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProfileIcon = styled.div`
  width: 35px;
  height: 35px;
  background: #60a5fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  color: white;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const Username = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #60a5fa;
`;

const Text = styled.p`
  font-size: 0.95rem;
  color: #bbb;
  margin-top: 0.2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: ${props => props.danger ? "#ef4444" : "#60a5fa"};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.danger ? "#dc2626" : "#3b82f6"};
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  background: #15151f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
`;

const SendButton = styled.button`
  background: #60a5fa;
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3b82f6;
  }
`;

// 🔹 Discussions Component
export default function DiscussionsTab({ questionId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // ✅ Fetch discussions on load
  useEffect(() => {
    fetchDiscussions();
    const storedUserId = parseInt(localStorage.getItem("user_id")); // ✅ Fetch user ID from localStorage
    if (storedUserId) setLoggedInUserId(storedUserId);
  }, []);

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`https://sqlpremierleague-backend.onrender.com/discussion/${questionId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
    }
  };

  // ✅ Post a new comment
  const postComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch("https://sqlpremierleague-backend.onrender.com/discussion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question_id: questionId, content: newComment }),
      });

      if (response.ok) {
        fetchDiscussions();
        setNewComment("");
      }
    } catch (error) {
    }
  };

  // ✅ Like/Unlike Comment
  const toggleLike = async (commentId) => {
    try {
      await fetch(`https://sqlpremierleague-backend.onrender.com/discussion/like/${commentId}`, {
        method: "POST",
        credentials: "include",
      });
      fetchDiscussions();
    } catch (error) {
    }
  };

  // ✅ Edit Comment
  const editComment = async (commentId) => {
    try {
      await fetch(`https://sqlpremierleague-backend.onrender.com/discussion/edit/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: editContent }),
      });
      setEditingCommentId(null);
      fetchDiscussions();
    } catch (error) {
    }
  };

  // ✅ Delete Comment
  const deleteComment = async (commentId) => {
    try {
      await fetch(`https://sqlpremierleague-backend.onrender.com/discussion/delete/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchDiscussions();
    } catch (error) {
    }
  };

  return (
    <Container>
      <h3>Discussions</h3>

      <InputContainer>
        <Input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <SendButton onClick={postComment}><Send size={18} /></SendButton>
      </InputContainer>

      {comments.map((comment) => (
        <CommentBox key={comment.id}>
          <ProfileIcon>{comment.username.charAt(0)}</ProfileIcon>
          <CommentContent>
            <Username>{comment.username}</Username>
            {editingCommentId === comment.id ? (
              <Input value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            ) : (
              <Text>{comment.content}</Text>
            )}
            <ActionButtons>
              <Button onClick={() => toggleLike(comment.id)}><ThumbsUp size={14} /> {comment.likes}</Button>

              {/* ✅ Only show Edit/Delete if the logged-in user is the comment owner */}
              {comment.user_id === loggedInUserId && (
                <>
                  {editingCommentId === comment.id ? (
                    <>
                      <Button onClick={() => editComment(comment.id)}><Check size={14} /></Button>
                      <Button onClick={() => setEditingCommentId(null)}><X size={14} /></Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditingCommentId(comment.id) || setEditContent(comment.content)}>
                      <Edit size={14} />
                    </Button>
                  )}
                  <Button danger onClick={() => deleteComment(comment.id)}><Trash2 size={14} /></Button>
                </>
              )}
            </ActionButtons>
          </CommentContent>
        </CommentBox>
      ))}
    </Container>
  );
}
