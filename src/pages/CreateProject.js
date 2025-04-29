import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../Styles/ProjectStyles.css";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("https://task-tracker-backend-1-7vae.onrender.com/api/projects", { title }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card animate-fade">
        <div className="form-header">
          <h2>Create New Project</h2>
        </div>
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input 
                className="form-input" 
                placeholder="Enter project title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Project"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;