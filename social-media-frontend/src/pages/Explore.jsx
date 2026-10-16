import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSearch, FaUsers, FaCompass } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { getPosts, searchUsers } from "../services/postService";
import "../App.css";

function Explore() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/"); return; }
    getPosts().then(r => setPosts(Array.isArray(r.data) ? r.data : [])).catch(() => setPosts([])).finally(() => setLoading(false));
  }, [navigate]);
  useEffect(() => {
    let active = true;
    if (query.trim().length < 2) { setUsers([]); return () => { active = false; }; }
    setSearching(true);
    const timer = setTimeout(() => searchUsers(query.trim()).then(r => { if (active) setUsers(Array.isArray(r.data) ? r.data : []); }).catch(() => { if (active) setUsers([]); }).finally(() => { if (active) setSearching(false); }), 250);
    return () => { active = false; clearTimeout(timer); };
  }, [query]);
  const filteredPosts = query.trim().length >= 2 ? posts.filter(p => `${p.content || ""} ${p.user?.username || ""} ${p.user?.fullName || ""}`.toLowerCase().includes(query.trim().toLowerCase())) : posts;
  const removePost = id => setPosts(prev => prev.filter(p => String(p.id) !== String(id)));
  return <div className="feed-page"><Navbar/><div className="feed-layout"><Sidebar/><main className="feed-container explore-container">
    <div className="feed-header"><div><h2 className="feed-title">{"// Explore the Grid"}</h2><p className="section-subtitle">Find your people. Discover your corner of the internet.</p></div><FaCompass className="explore-mark"/></div>
    <div className="explore-search"><FaSearch/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people, handles, or post text…" aria-label="Search people and posts"/>{query && <button onClick={() => setQuery("")}>Clear</button>}</div>
    {query.trim().length >= 2 && <section className="explore-results"><div className="mini-section-title"><FaUsers/> PEOPLE {searching && <span>searching…</span>}</div>{users.length ? users.map(u => <button className="explore-user" key={u.id} onClick={() => navigate(`/profile/${u.id}`)}><span className="mini-avatar">{(u.username || "??").slice(0,2).toUpperCase()}</span><span><strong>{u.fullName || u.username}</strong><small>@{u.username}</small></span><span className="explore-open">VIEW PROFILE ↗</span></button>) : !searching && <p className="comments-empty">No matching people found.</p>}</section>}
    <div className="mini-section-title"><FaCompass/> {query.trim().length >= 2 ? "MATCHING POSTS" : "LATEST TRANSMISSIONS"}</div>
    {loading ? <div className="loading">SCANNING THE GRID…</div> : filteredPosts.length ? filteredPosts.map((p,i) => <div key={p.id} style={{animationDelay:`${i*.04}s`}}><PostCard post={p} onDeleted={removePost}/></div>) : <div className="empty-state-card"><span>✦</span><h3>Nothing on this frequency yet</h3><p>Try another search, or be the first to broadcast something new.</p><button className="create-post-btn" onClick={() => navigate("/create")}>+ Create a post</button></div>}
  </main></div></div>;
}
export default Explore;
