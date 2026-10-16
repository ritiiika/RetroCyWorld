import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart, FaRegComment, FaBookmark, FaRegBookmark, FaShareAlt, FaEllipsisH, FaPaperPlane } from "react-icons/fa";
import { likePost, addComment, getCommentsByPost, sharePost, deletePost, getTokenPayload, getUserByEmail } from "../services/postService";
import "../App.css";

const SAVED_KEY = "retrosocial:saved-posts";
function readSaved() { try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; } }
function timeAgo(dateStr) {
  if (!dateStr) return "some time ago";
  const date = new Date(dateStr); if (Number.isNaN(date.getTime())) return "recently";
  const diff = Math.max(0, Date.now() - date.getTime()); const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now"; if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60); if (hrs < 24) return `${hrs}h ago`; return `${Math.floor(hrs / 24)}d ago`;
}

function PostCard({ post, onDeleted }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(Boolean(post.likedByCurrentUser));
  const [likeCount, setLikeCount] = useState(Number(post.likes || 0));
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(() => readSaved().some(p => String(p.id) === String(post.id)));
  const [currentUserId, setCurrentUserId] = useState(null);
  const [notice, setNotice] = useState("");
  const username = post.user?.username || "anonymous";
  const initials = username.slice(0, 2).toUpperCase();
  const ownPost = currentUserId != null && String(currentUserId) === String(post.user?.id);

  useEffect(() => {
    const payload = getTokenPayload();
    if (payload?.sub) getUserByEmail(payload.sub).then(r => setCurrentUserId(r.data?.id ?? null)).catch(() => {});
  }, []);

  const handleLike = async () => {
    if (busy) return; setBusy(true); setNotice("");
    try { const r = await likePost(post.id); const updated = r?.data || {}; setLiked(Boolean(updated.likedByCurrentUser)); setLikeCount(Number.isFinite(updated.likes) ? updated.likes : likeCount + (liked ? -1 : 1)); }
    catch { setNotice("Could not update like. Check your connection and try again."); }
    finally { setBusy(false); }
  };

  const toggleComments = async () => {
    const next = !showComments; setShowComments(next);
    if (next) { try { const r = await getCommentsByPost(post.id); setComments(Array.isArray(r.data) ? r.data : []); } catch { setNotice("Comments could not be loaded right now."); } }
  };

  const handleComment = async (e) => {
    e.preventDefault(); if (!comment.trim() || submitting) return; setSubmitting(true); setNotice("");
    try { const r = await addComment(post.id, comment.trim()); setComments(prev => [...prev, r.data || { message: comment.trim(), user: { username: "you" }, createdAt: new Date().toISOString() }]); setComment(""); setShowComments(true); }
    catch { setNotice("Comment could not be posted. Please try again."); }
    finally { setSubmitting(false); }
  };

  const toggleSave = () => {
    const existing = readSaved();
    const next = saved ? existing.filter(p => String(p.id) !== String(post.id)) : [...existing.filter(p => String(p.id) !== String(post.id)), post];
    localStorage.setItem(SAVED_KEY, JSON.stringify(next)); setSaved(!saved); setNotice(saved ? "Removed from your collection." : "Saved to your collection.");
    window.dispatchEvent(new Event("retrosocial:saved-change"));
  };

  const handleShare = async () => {
    try { await sharePost(post.id); } catch { /* Sharing the link can still work if the counter endpoint is unavailable. */ }
    const url = `${window.location.origin}/feed#post-${post.id}`;
    try { await navigator.clipboard.writeText(url); setNotice("Post link copied to clipboard."); }
    catch { setNotice(`Share this post: ${url}`); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post permanently?")) return;
    try { await deletePost(post.id); if (onDeleted) onDeleted(post.id); else window.location.reload(); }
    catch { setNotice("This post could not be deleted."); }
  };

  return (
    <article className="post" id={`post-${post.id}`}>
      <div className="post-window-bar"><span className="dot red"/><span className="dot yellow"/><span className="dot green"/><span className="post-window-title">{"POST_" + post.id}</span><span className="post-window-meta">{post.imageUrl ? "MEDIA ATTACHED" : "TEXT TRANSMISSION"}</span></div>
      <div className="post-header">
        <button className="post-avatar avatar-button" onClick={() => post.user?.id && navigate(`/profile/${post.user.id}`)} aria-label={`Open ${username}'s profile`}>{initials}</button>
        <button className="post-username username-button" onClick={() => post.user?.id && navigate(`/profile/${post.user.id}`)}>@{username}</button>
        <span className="post-time">{timeAgo(post.createdAt)}</span>
        {ownPost && <button className="post-more" title="Delete post" onClick={handleDelete}><FaEllipsisH /></button>}
      </div>
      {post.content && <div className="post-content">{post.content}</div>}
      {post.imageUrl && <img src={post.imageUrl} className="post-image" alt={`Post by ${username}`} loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }} />}
      <div className="post-actions">
        <button className={`action-btn ${liked ? "liked" : ""}`} onClick={handleLike} disabled={busy} aria-label={liked ? "Unlike post" : "Like post"}>{liked ? <FaHeart /> : <FaRegHeart />} <span>{likeCount}</span></button>
        <button className={`action-btn ${showComments ? "action-active" : ""}`} onClick={toggleComments}><FaRegComment /> <span>Comments</span></button>
        <button className={`action-btn ${saved ? "saved-action" : ""}`} onClick={toggleSave}>{saved ? <FaBookmark /> : <FaRegBookmark />} <span>{saved ? "Saved" : "Save"}</span></button>
        <button className="action-btn" onClick={handleShare}><FaShareAlt /> <span>Share</span></button>
      </div>
      {notice && <div className="post-notice" role="status">{notice}</div>}
      {showComments && <section className="comments-panel" aria-label="Comments">
        <div className="comments-heading">{"// TRANSMISSIONS "}<span>{comments.length}</span></div>
        {comments.length === 0 ? <p className="comments-empty">No comments yet. Start the conversation ✦</p> : comments.map((c, i) => <div className="comment-item" key={c.id || `${c.createdAt}-${i}`}><span className="comment-author">@{c.user?.username || "user"}</span><span>{c.message}</span></div>)}
        <form className="comment-box-wrap" onSubmit={handleComment}><input className="comment-box" placeholder="Write a thoughtful comment…" value={comment} maxLength={1000} onChange={e => setComment(e.target.value)} disabled={submitting}/><button className="comment-submit" type="submit" disabled={!comment.trim() || submitting} aria-label="Send comment">{submitting ? "…" : <FaPaperPlane />}</button></form>
      </section>}
    </article>
  );
}
export default PostCard;
