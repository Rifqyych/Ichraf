"use client";

import { useState } from "react";
import type { Project } from "../data/team";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="project-card"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <div className={`project-visual visual-${project.number}`} aria-hidden="true">
          <div className="visual-browser-bar">
            <span />
            <span />
            <span />
            <i />
          </div>
          <div className="visual-copy">
            <b>RPL PROJECT</b>
            <strong>{project.category}</strong>
            <em />
          </div>
          <div className="visual-panel">
            <span className="visual-folder">⌁</span>
            <span className="visual-folder">⌁</span>
            <span className="visual-folder">⌁</span>
          </div>
        </div>

        <div className="project-card-top">
          <span>{project.number}</span>
          <span>{project.category}</span>
        </div>

        <div>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
        </div>

        <strong>Klik untuk detail ↗</strong>
      </button>

      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <section
            className="project-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-button"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup detail project"
            >
              ×
            </button>

            <p className="eyebrow">{project.category}</p>
            <h2>{project.title}</h2>
            <p>{project.description}</p>

            <h3>Tools yang digunakan</h3>
            <div className="skill-list">
              {project.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
