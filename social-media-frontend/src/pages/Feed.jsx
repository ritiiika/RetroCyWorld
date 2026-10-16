import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaGlobeAmericas, FaSyncAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import PostCard from "../components/PostCard";
import { getPosts, getTimeline, getUserByEmail, getTokenPayload } from "../services/postService";
import "../App.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const loadPosts = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true); else setLoading(true);
    try {
      let response;
      if (mode === "following") {
        const payload = getTokenPayload();
        const email = payload?.sub;
        if (!email) throw new Error("Your session has expired");
        const user = await getUserByEmail(email);
        response = await getTimeline(user.data.id);
      } else response = await getPosts();
      const data = Array.isArray(response.data) ? response.data : [];
      setPosts(data.slice().sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
    } catch (err) {
      console.error("Feed load error:", err); setPosts([]);
    } finally { setLoading(false); setRefreshing(false); }
  }, [mode]);
  useEffect(() => { if (!localStorage.getItem("token")) { navigate("/"); return; } loadPosts(); }, [navigate, loadPosts]);
  const removePost = id => setPosts(prev => prev.filter(p => String(p.id) !== String(id)));
  return <div className="feed-page"><Navbar/><div className="feed-layout"><Sidebar/>
    <main className="feed-container">
      <div className="feed-header"><div><h2 className="feed-title">{"// Home Feed"}</h2><p className="section-subtitle">Your little corner of the digital universe.</p></div><button className="create-post-btn" onClick={() => navigate("/create")}>+ Broadcast</button></div>
      <div className="feed-controls"><div className="feed-tabs"><button className={mode === "all" ? "feed-tab active" : "feed-tab"} onClick={() => setMode("all")}><FaGlobeAmericas/> Everyone</button><button className={mode === "following" ? "feed-tab active" : "feed-tab"} onClick={() => setMode("following")}><FaUsers/> Friends First</button></div><button className="refresh-btn" onClick={() => loadPosts(true)} disabled={loading || refreshing}><FaSyncAlt className={refreshing ? "spin-icon" : ""}/> {refreshing ? "Syncing" : "Refresh"}</button></div>
      {mode === "following" && <div className="collection-note">✦ Friends First shows posts from you and the people you follow, in newest-first order.</div>}
      {loading ? <div className="loading">CONNECTING TO THE GRID…</div> : posts.length === 0 ? <div className="empty-state-card"><span>✦</span><h3>{mode === "following" ? "Your circle is quiet" : "The grid is yours to fill"}</h3><p>{mode === "following" ? "Follow people from Explore and their posts will appear here." : "No posts have been broadcast yet. Share a thought, photo, or tiny moment."}</p><button className="create-post-btn" onClick={() => mode === "following" ? navigate("/explore") : navigate("/create")}>{mode === "following" ? "Find your people" : "+ Create your first post"}</button></div> : posts.map((post,i)=><div key={post.id} style={{animationDelay:`${i*.05}s`}}><PostCard post={post} onDeleted={removePost}/></div>)}
    </main><RightPanel/></div></div>;
}
export default Feed;
