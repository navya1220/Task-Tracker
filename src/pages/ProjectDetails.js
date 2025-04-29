import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../Styles/TaskStyles.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectTitle, setProjectTitle] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    status: ""
  });
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const { user } = useContext(AuthContext);
  
  // Ref for task cards to apply animations
  const taskRefs = useRef({});

  useEffect(() => {
    fetchProjectData();
  }, [id, user]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);

      const projectRes = await axios.get(`http://localhost:5000/api/projects`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProjectTitle(projectRes.data.title);


      const tasksRes = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasksRes.data);
    } catch (error) {
      console.error("Error fetching project data:", error);
      setError("Failed to load project data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowConfirmation(true);
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
    setShowConfirmation(false);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      setDeletingTaskId(taskToDelete);
      
      // Add animation class
      if (taskRefs.current[taskToDelete]) {
        taskRefs.current[taskToDelete].classList.add('deleting');
      }
      
      // Wait for animation to complete
      setTimeout(async () => {
        await axios.delete(`http://localhost:5000/api/tasks/task/${taskToDelete}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        
        // Update tasks list after deletion
        setTasks(tasks.filter(task => task._id !== taskToDelete));
        setShowConfirmation(false);
        setTaskToDelete(null);
        setDeletingTaskId(null);
      }, 500); 
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
      setDeletingTaskId(null);
      if (taskRefs.current[taskToDelete]) {
        taskRefs.current[taskToDelete].classList.remove('deleting');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(task => task._id === taskId);
      const updatedTask = { ...task, status: newStatus };
      
      // Update UI first for better UX
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
      
      // Then update in the backend
      await axios.patch(`http://localhost:5000/api/tasks/task/${taskId}`, updatedTask, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      
    } catch (error) {
      console.error("Error updating task status:", error);
      setError("Failed to update task status. Please try again.");
      // Revert the UI change on error
      fetchProjectData();
    }
  };

  const startEditing = (task) => {
    setIsEditing(task._id);
    setEditFormData({
      title: task.title,
      description: task.description || "",
      status: task.status
    });
  };

  const cancelEditing = () => {
    setIsEditing(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditSubmit = async (taskId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/tasks/task/${taskId}`,
        editFormData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      // Update tasks list after edit
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Pending':
        return 'badge-pending';
      case 'In Progress':
        return 'badge-in-progress';
      case 'Completed':
        return 'badge-completed';
      default:
        return 'badge-pending';
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="project-details-container">
      <div className="project-header">
        <h1 className="project-title">{projectTitle || 'Project'} Tasks</h1>
        <div className="project-actions">
          <Link to={`/project/${id}/task/create`} className="btn btn-primary">
            <i className="fas fa-plus"></i> Add Task
          </Link>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tasks-container">
        {loading ? (
          <div className="loading-spinner">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found for this project.</p>
            <Link to={`/project/${id}/task/create`} className="btn btn-primary">
              <i className="fas fa-plus"></i> Add Your First Task
            </Link>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div 
                key={task._id} 
                className="task-card"
                ref={el => taskRefs.current[task._id] = el}
                style={{
                  borderTopColor: 
                    task.status === 'Completed' ? '#10b981' : 
                    task.status === 'In Progress' ? '#0958d9' : '#b78105'
                }}
              >
                <div className={`status-badge ${getStatusBadgeClass(task.status)}`}>
                  {task.status}
                </div>
                
                {isEditing === task._id ? (
                  <div className="task-edit-form">
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditFormChange}
                      className="edit-input"
                      placeholder="Task title"
                    />
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditFormChange}
                      className="edit-textarea"
                      placeholder="Description"
                    ></textarea>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditFormChange}
                      className="edit-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <div className="edit-actions">
                      <button 
                        onClick={() => handleEditSubmit(task._id)}
                        className="btn btn-save"
                      >
                        <i className="fas fa-check"></i> Save
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="btn btn-cancel"
                      >
                        <i className="fas fa-times"></i> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-header">
                      <h3 className="task-title">{task.title}</h3>
                      <div className="task-actions" style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => startEditing(task)}
                          className="btn btn-edit"
                          aria-label="Edit task"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        {/* Explicit styling to ensure visibility */}
                        <button
  onClick={() => confirmDeleteTask(task._id)}
  className="btn btn-delete"
  aria-label="Delete task"
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', 
    color: '#f87171',             
    border: '1px solid #f87171',  
    borderRadius: '4px',
    padding: '4px 8px',
    cursor: 'pointer'
  }}
>
  <span>🗑️</span>
</button>

                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                    
                    <div className="task-footer">
                      <div className="status-dropdown">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className={`status-select ${getStatusClass(task.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      {task.completedAt && (
                        <div className="completed-date">
                          Completed: {new Date(task.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="navigation-footer">
        <Link to="/dashboard" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="confirmation-dialog" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="confirmation-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h3 className="confirmation-title">Delete Task</h3>
            <p className="confirmation-message">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="confirmation-actions" style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px'
            }}>
              <button 
                onClick={cancelDeleteTask}
                className="btn btn-cancel"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e5e5e5',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteTask}
                className="btn btn-confirm-delete"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f87171',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;