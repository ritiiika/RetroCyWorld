import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import "../App.css";
const KEY = "retrosocial:saved-posts";
function readSaved(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
function Saved(){
 const navigate=useNavigate(); const [posts,setPosts]=useState(readSaved);
 useEffect(()=>{if(!localStorage.getItem("token")){navigate("/");return;} const refresh=()=>setPosts(readSaved()); window.addEventListener("retrosocial:saved-change",refresh); window.addEventListener("storage",refresh); return()=>{window.removeEventListener("retrosocial:saved-change",refresh);window.removeEventListener("storage",refresh)}},[navigate]);
 return <div className="feed-page"><Navbar/><div className="feed-layout"><Sidebar/><main className="feed-container"><div className="feed-header"><div><h2 className="feed-title">{"// Your Collection"}</h2><p className="section-subtitle">Little things worth coming back to.</p></div><FaBookmark className="explore-mark"/></div><div className="collection-note">✦ Saved posts are stored locally in this browser on this device.</div>{posts.length?posts.slice().reverse().map((p,i)=><div key={p.id||i}><PostCard post={p}/></div>):<div className="empty-state-card"><span>♡</span><h3>Your collection is waiting</h3><p>Tap Save on a post in your feed to keep it here for later.</p><button className="create-post-btn" onClick={()=>navigate("/feed")}>Explore the feed</button></div>}</main></div></div>
}
export default Saved;
