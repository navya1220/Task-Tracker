import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/AuthStyles.css"; 

const SignupPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("https://task-tracker-backend-1-7vae.onrender.com/api/auth/signup", form);
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate__animated animate__fadeIn">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our community today</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input 
              className="form-input" 
              placeholder="Name" 
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              required
            />
          </div>
          <div className="form-group">
            <input 
              className="form-input" 
              placeholder="Email" 
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              required
            />
          </div>
          <div className="form-group">
            <input 
              className="form-input" 
              placeholder="Password" 
              type="password" 
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              required
            />
          </div>
          <div className="form-group">
            <input 
              className="form-input" 
              placeholder="Country" 
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })} 
              required
            />
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              "Sign Up"
            )}
          </button>
          
          <div className="auth-footer">
            Already have an account? <a href="/">Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;