import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../Styles/ProjectStyles.css";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("https://task-tracker-backend-1-7vae.onrender.com/api/projects", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  return (
    <div className="container">
      <div className="dashboard animate-fade">
        <div className="dashboard-header">
          <h2 className="dashboard-title">My Projects</h2>
          <Link to="/project/create" className="btn btn-primary btn-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Create New Project
          </Link>
        </div>

        {loading ? (
          <div className="animate-pulse">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="animate-slide-up">
            <p>You don't have any projects yet. Create your first project to get started!</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((proj, index) => (
              <div key={proj._id} className={`project-card staggered-item`}>
                <div className="project-card-body">
                  <h3 className="project-card-title">{proj.name}</h3>
                </div>
                <div className="project-card-footer">
                  <Link to={`/project/${proj._id}`} className="project-link">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
