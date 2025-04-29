import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../Styles/ProjectStyles.css"; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo animate-fade">
          <Link to={user ? "/dashboard" : "/"}>
            <span className="logo-text">TaskFlow</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="navbar-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`navbar-toggle-icon ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Navigation links */}
        <div className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
          <ul className="navbar-nav">
            {user && (
              <>
                <li className="nav-item animate-slide-down" style={{animationDelay: "0.1s"}}>
                  <Link 
                    to="/dashboard" 
                    className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item animate-slide-down" style={{animationDelay: "0.2s"}}>
                  <Link 
                    to="/project/create" 
                    className={`nav-link ${isActive("/project/create") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    New Project
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="navbar-actions">
            {user ? (
              <button 
                onClick={handleLogout} 
                className="btn-logout animate-slide-down"
                style={{animationDelay: "0.3s"}}
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`btn-login animate-slide-down ${isActive("/") || isActive("/login") ? "active" : ""}`}
                  style={{animationDelay: "0.3s"}}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`btn-signup animate-slide-down ${isActive("/signup") ? "active" : ""}`}
                  style={{animationDelay: "0.4s"}}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;