import React from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <div style={{ border: "1px solid #999", padding: "12px", marginBottom: "10px", borderRadius: "6px" }}>
      <h2>{project.title}</h2>
      <Link to={`/project/${project._id}`}>View Project</Link>
    </div>
  );
};

export default ProjectCard;
