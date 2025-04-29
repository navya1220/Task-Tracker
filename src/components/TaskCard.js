import React from "react";

const TaskCard = ({ task }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "8px", margin: "8px 0", borderRadius: "6px" }}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p><strong>Status:</strong> {task.status}</p>
    </div>
  );
};

export default TaskCard;
