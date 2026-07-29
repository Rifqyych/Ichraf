"use client";

import { useEffect, useMemo, useState } from "react";

type ProjectCardProps = {
number: string;
category: string;
title: string;
description: string;
tools: string[];
};

type CommentItem = {
name: string;
message: string;
date: string;
};

export default function ProjectCard({
number,
category,
title,
description,
tools,
}: ProjectCardProps) {
const [isOpen, setIsOpen] = useState(false);

const storageKey = useMemo(() => {
  return `project-${number}-${title}`;
}, [number, title]);

const [liked, setLiked] = useState(false);
const [likes, setLikes] = useState(0);

const [name, setName] = useState("");
const [message, setMessage] = useState("");
const [comments, setComments] = useState<CommentItem[]>([]);

useEffect(() => {
if (typeof window === "undefined") return;

const savedLikes = localStorage.getItem(`${storageKey}-likes`);
const savedLiked = localStorage.getItem(`${storageKey}-liked`);
const savedComments = localStorage.getItem(`${storageKey}-comments`);

if (savedLikes) setLikes(Number(savedLikes));
if (savedLiked) setLiked(savedLiked === "true");
if (savedComments) setComments(JSON.parse(savedComments));

}, [storageKey]);

const toggleLike = () => {
const nextLiked = !liked;
const nextLikes = nextLiked ? likes + 1 : likes - 1;

setLiked(nextLiked);
setLikes(nextLikes);

localStorage.setItem(`${storageKey}-liked`, String(nextLiked));
localStorage.setItem(`${storageKey}-likes`, String(nextLikes));

};

const addComment = () => {
if (!name.trim() || !message.trim()) return;

const newComment: CommentItem = {
  name: name.trim(),
  message: message.trim(),
  date: new Date().toLocaleString("id-ID"),
};

const updated = [newComment, ...comments];
setComments(updated);
localStorage.setItem(`${storageKey}-comments`, JSON.stringify(updated));

setName("");
setMessage("");

};

return (
<>
<button
className="project-card"
type="button"
onClick={() => setIsOpen(true)}
>
<div className={`project-visual visual-${number}`} aria-hidden="true"> <div className="visual-browser-bar"> <span /> <span /> <span /> <i /> </div>

      <div className="visual-copy">
        <b>RPL PROJECT</b>
        <strong>{category}</strong>
        <em />
      </div>

      <div className="visual-panel">
        <span className="visual-folder">⌁</span>
        <span className="visual-folder">⌁</span>
        <span className="visual-folder">⌁</span>
      </div>
    </div>

    <div className="project-card-top">
      <span>{number}</span>
      <span>{category}</span>
    </div>

    <div>
      <h2>{title}</h2>
      <p>{description}</p>

      {likes >= 5 && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          🔥 Populer
        </p>
      )}
    </div>

    <strong>Klik untuk detail ↗</strong>
  </button>

  {isOpen && (
    <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
      <section
        className="project-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-button"
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Tutup detail project"
        >

        </button>

        <p className="eyebrow">{category}</p>
        <h2>{title}</h2>
        <p>{description}</p>

        <h3>Tools yang digunakan</h3>

        <div className="skill-list">
          {tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>

        <div className="like-section">
          <div className="like-title">
            <h3>❤️ Berikan Like</h3>

            {likes >= 5 && (
              <span className="popular-badge">🔥 POPULER</span>
            )}
          </div>

          <div className="like-count">
            <div className="like-icon">❤️</div>

            <div className="like-number">
              <strong>{likes}</strong>
              <span>{likes === 1 ? "Like" : "Likes"}</span>
            </div>
          </div>

          <div className="like-progress">
            <div
              className="like-progress-fill"
              style={{ width: `${Math.min((likes / 5) * 100, 100)}%` }}
            />
          </div>

          <button
            type="button"
            className={`like-button ${liked ? "liked" : ""}`}
            onClick={toggleLike}
          >
            {liked ? "💔 Batal Suka" : "❤️ Suka Project Ini"}
          </button>

          {liked && (
            <div className="like-message">
              Terima kasih telah memberikan like pada project ini!
            </div>
          )}
        </div>

        <div className="comment-section">
          <h3>💬 Komentar Pengunjung</h3>

          <div className="comment-form">
            <input
              type="text"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              placeholder="Tulis komentar tentang project ini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              type="button"
              className="comment-button"
              onClick={addComment}
            >
              Kirim Komentar
            </button>
          </div>

          {comments.length === 0 ? (
            <div className="comment-empty">
              Belum ada komentar. Jadilah orang pertama yang memberi
              pendapat tentang project ini.
            </div>
          ) : (
            <div className="comment-list">
              {comments.map((comment, index) => (
                <div className="comment-item" key={index}>
                  <strong>{comment.name}</strong>
                  <p>{comment.message}</p>
                  <div className="comment-date">{comment.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )}
</>

);
}
