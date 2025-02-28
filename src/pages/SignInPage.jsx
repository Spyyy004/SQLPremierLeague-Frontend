"use client"

import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, User } from "lucide-react";
import ReactGA from 'react-ga4';
import Mixpanel from "../utils/mixpanel";
// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
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
  color: #e1e2e5;
  padding: 1rem;
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  animation: ${fadeIn} 0.6s ease-out;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 480px) {
    padding: 2rem;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-left: 2.75rem;
  padding-right: ${props => props.type === 'password' ? '2.75rem' : '1rem'};
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #e1e2e5;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }
  
  &::placeholder {
    color: #64748b;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 1rem;
  color: #64748b;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  
  &:hover {
    color: #e1e2e5;
  }
`;

const LoadingButton = styled.button`
  position: relative;
  width: 100%;
  padding: 1rem;
  background: ${props => props.loading ? 
    'linear-gradient(135deg, #4f8bfa 0%, #6b48f6 100%)' : 
    'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%)'
  };
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 12px;
  border: none;
  cursor: ${props => props.loading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorContainer = styled.div`
  padding: 0.75rem;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 12px;
  color: #f87171;
  font-size: 0.9rem;
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AdditionalLinks = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  
  a {
    color: #60a5fa;
    text-decoration: none;
    margin-left: 0.25rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const AuthToggle = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? 
    'linear-gradient(135deg, #60a5fa 0%, #8b5cf6 100%)' : 
    'transparent'
  };
  color: ${props => props.active ? '#ffffff' : '#94a3b8'};

  &:hover {
    color: ${props => props.active ? '#ffffff' : '#e1e2e5'};
  }
`;


export default function SignInPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
  
    setError("");
    setLoading(true);
  
    const endpoint = isLogin ? "login" : "register";
  
    try {
      // 🔹 Mixpanel Event: Authentication Attempt
      Mixpanel.track("Authentication Attempt", {
        type: isLogin ? "Login" : "Registration",
        email,
      });
  
      ReactGA.event({
        category: "Authentication",
        action: isLogin ? "Login Attempt" : "Registration Attempt",
        label: email, // Track the user’s email for debugging (consider hashing for privacy)
      });
  
      // Step 1: Call Register/Login API
      const response = await fetch(`https://sqlpremierleague-backend.onrender.com/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin ? { email, password } : { email, password, username: name }
        ),
        credentials: "include" // ✅ Ensures cookies (like HttpOnly JWT) are sent with the request
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }
  
      if (!isLogin) {
        // Step 2: If Register was successful, log in the user automatically
        const loginResponse = await fetch(`https://sqlpremierleague-backend.onrender.com/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include"
        });
  
        const loginData = await loginResponse.json();
  
        if (!loginResponse.ok) {
          throw new Error(loginData.error || "Login after registration failed");
        }
  
        // Step 3: Store the token from the login response
        localStorage.setItem("token", loginData.access_token);
        localStorage.setItem("refreshtoken", loginData.refresh_token);
        localStorage.setItem("csrfToken", loginData.csrf_token);
      } else {
        // Step 3: Store the token if it was a direct login
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refreshtoken", data.refresh_token);
        localStorage.setItem("csrfToken", data.csrf_token);
      }
  
      // 🔹 Mixpanel Event: Successful Authentication
      Mixpanel.identify(email);
      Mixpanel.people.set({ email, login_type: isLogin ? "Login" : "Registration" });
      Mixpanel.track(isLogin ? "User Logged In" : "User Registered", { email });
  
      // Step 4: Navigate to challenges page
      const redirectTo = location.state?.from || "/categories";
      navigate(redirectTo);
  
    } catch (err) {
      setError(err.message);
  
      // 🔹 Mixpanel Event: Authentication Failed
      Mixpanel.track("Authentication Failed", {
        type: isLogin ? "Login" : "Registration",
        email,
        error_message: err.message,
      });
  
    } finally {
      setLoading(false);
    }
  };
  
  
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const handleModeSwitch = (mode) => {
    if (mode !== isLogin) {
      setIsLogin(mode);
      resetForm();
    }
  };
  return (
    <PageContainer>
      <GlassCard>
        <FormHeader>
        <Title>{isLogin ? 'Welcome Back' : 'Create Account'}</Title>
          <Subtitle>
            {isLogin 
              ? 'Sign in to continue your SQL journey' 
              : 'Join us and start your SQL journey'}
          </Subtitle>
        </FormHeader>
        <AuthToggle>
          <ToggleButton 
            active={isLogin} 
            onClick={() => handleModeSwitch(true)}
          >
            Sign In
          </ToggleButton>
          <ToggleButton 
            active={!isLogin} 
            onClick={() => handleModeSwitch(false)}
          >
            Sign Up
          </ToggleButton>
        </AuthToggle>
        <Form onSubmit={handleSubmit}>
          {error && (
            <ErrorContainer>
              <span>{error}</span>
            </ErrorContainer>
          )}

          {!isLogin && (
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <InputWrapper>
                <InputIcon>
                  <User size={18} />
                </InputIcon>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  disabled={loading}
                  aria-label="Full Name"
                />
              </InputWrapper>
            </FormGroup>
          )}

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <InputIcon>
                <Mail size={18} />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                aria-label="Email Address"
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                aria-label="Password"
              />
              <TogglePassword
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </TogglePassword>
            </InputWrapper>
          </FormGroup>

          <LoadingButton type="submit" disabled={loading} loading={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </LoadingButton>
        </Form>

        <AdditionalLinks>
          {isLogin ? (
            <>
              Don't have an account?
              <a href="#" onClick={(e) => { 
                e.preventDefault(); 
                handleModeSwitch(false);
              }}>Sign up</a>
            </>
          ) : (
            <>
              Already have an account?
              <a href="#" onClick={(e) => {
                e.preventDefault();
                handleModeSwitch(true);
              }}>Sign in</a>
            </>
          )}
        </AdditionalLinks>
      </GlassCard>
    </PageContainer>
  );
}




