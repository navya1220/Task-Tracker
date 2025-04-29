import React, { useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../Styles/ProjectStyles.css";

const CreateTask = () => {
  const [task, setTask] = useState({ title: "", description: "", status: "Pending" });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { id } = useParams(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/tasks/${id}`, task, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate(`/project/${id}`);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card animate-fade">
        <div className="form-header">
          <h2>Create New Task</h2>
        </div>
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input 
                className="form-input" 
                placeholder="Enter task title" 
                value={task.title} 
                onChange={(e) => setTask({ ...task, title: e.target.value })} 
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-textarea" 
                placeholder="Enter task description" 
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })} 
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                className="form-select" 
                value={task.status}
                onChange={(e) => setTask({ ...task, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Task"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
