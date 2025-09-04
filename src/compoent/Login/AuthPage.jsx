import React, { useState } from "react";

import "./AuthPage.css";
import { useNavigate } from "react-router";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const API_BASE ="https://townmanor.ai/api";

  const persistUser = (user) => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (_) {
      // ignore storage errors
    }
  };

  const handleSignup = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          phone_number: phone || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Signup failed", data);
        alert(data?.message || "Signup failed");
        return;
      }
      persistUser(data?.user);
      navigate("/");
      console.log("User signed up:", data?.user);
    } catch (error) {
      console.error("Signup Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Login failed", data);
        alert(data?.message || "Invalid credentials");
        return;
      }
      persistUser(data?.user);
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  return (
    <div className="auth-container">
      {/* Left Illustration */}
      <div className="auth-illustration">
        <img
          src="/ill.webp"
          alt="illustration"
        />
      </div>

      {/* Right Form */}
      <div className="auth-form-container">
        <div className="auth-toggle">
          <button
            className={isLogin ? "auth-toggle-btn active" : "auth-toggle-btn"}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={!isLogin ? "auth-toggle-btn active" : "auth-toggle-btn"}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <h2 className="auth-title">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>
        <p className="auth-subtitle">
          {isLogin
            ? "Please enter your details to sign in"
            : "Please enter your details to sign up"}
        </p>

        <form className="auth-form" onSubmit={onSubmit}>
          {!isLogin && (
            <>
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label>Phone</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isLogin && (
            <div className="auth-options">
              <div>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/" className="auth-forgot">
                Forgot password?
              </a>
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? (isLogin ? "Signing In..." : "Signing Up...") : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default AuthPage;
