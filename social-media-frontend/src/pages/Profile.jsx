import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTimes, FaCheck, FaUserAstronaut } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { getUserById, getUserByEmail, getUserPosts, getFollowersCount, getFollowingCount, updateUser } from "../services/postService";
import "../App.css";
const SAVED_KEY="retrosocial:saved-posts";
function readSaved(){try{return JSON.parse(localStorage.getItem(SAVED_KEY)||"[]")}catch{return []}}
function Profile(){
 const {id:paramId}=useParams(); const navigate=useNavigate();
 const [user,setUser]=useState(null); const [posts,setPosts]=useState([]); const [followers,setFollowers]=useState(0); const [following,setFollowing]=useState(0); const [activeTab,setActiveTab]=useState("posts"); const [loading,setLoading]=useState(true); const [isOwnProfile,setIsOwnProfile]=useState(false); const [editing,setEditing]=useState(false); const [saving,setSaving]=useState(false); const [error,setError]=useState(""); const [form,setForm]=useState({fullName:"",username:"",bio:""}); const [savedPosts,setSavedPosts]=useState(readSaved);
 const resolveUser=useCallback(async token=>{try{let userId=paramId;let loadedUser;if(!userId){const payload=JSON.parse(atob(token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));const r=await getUserByEmail(payload.sub);userId=r.data.id;loadedUser=r.data;setIsOwnProfile(true);}else{const r=await getUserById(userId);loadedUser=r.data;setIsOwnProfile(false);}setUser(loadedUser);setForm({fullName:loadedUser.fullName||"",username:loadedUser.username||"",bio:loadedUser.bio||""});const [postsR,followersR,followingR]=await Promise.all([getUserPosts(userId),getFollowersCount(userId),getFollowingCount(userId)]);setPosts(Array.isArray(postsR.data)?postsR.data:[]);setFollowers(followersR.data??0);setFollowing(followingR.data??0);}catch(err){console.error("Profile load error:",err)}finally{setLoading(false)}},[paramId]);
 useEffect(()=>{const token=localStorage.getItem("token");if(!token){navigate("/");return}resolveUser(token)},[navigate,resolveUser]);
 useEffect(()=>{const refresh=()=>setSavedPosts(readSaved());window.addEventListener("retrosocial:saved-change",refresh);return()=>window.removeEventListener("retrosocial:saved-change",refresh)},[]);
 const saveProfile=async e=>{e.preventDefault();setError("");if(form.fullName.trim().length<3||form.username.trim().length<3){setError("Name and username must contain at least 3 characters.");return}setSaving(true);try{const r=await updateUser(user.id,{fullName:form.fullName.trim(),username:form.username.trim(),bio:form.bio.trim()});setUser(r.data);setEditing(false)}catch(err){setError(err?.response?.data?.message||"Profile could not be updated. Please try again.")}finally{setSaving(false)}};
 if(loading)return <div className="feed-page"><Navbar/><div className="loading">LOADING PROFILE…</div></div>;
 if(!user)return <div className="feed-page"><Navbar/><div className="empty-feed">{"// user not found"}</div></div>;
 const initials=(user.username||"??").slice(0,2).toUpperCase(); const visiblePosts=activeTab==="saved"?savedPosts:posts;
 return <div className="feed-page"><Navbar/><div className="feed-layout"><Sidebar/><main className="profile-page-content">
   <div className="profile-banner"><div className="banner-sparkle">✦　☾　✧</div></div>
   <section className="profile-header-card">
    {isOwnProfile&&<button className="profile-edit-btn" onClick={()=>{setError("");setEditing(true)}}><FaEdit/> EDIT PROFILE</button>}
    <div className="profile-avatar-wrap"><div className="profile-avatar-inner">{initials}</div></div>
    <div className="profile-username">{user.fullName||user.username}</div><div className="profile-handle">@{user.username}</div>
    <div className="profile-bio">{user.bio|| (isOwnProfile?"Your bio is a blank canvas. Tell the grid a little about you.":"A mysterious soul in the RetroCyWorld grid.")}</div>
    <div className="profile-stats"><div className="stat-item"><span className="stat-num">{posts.length}</span><span className="stat-label">Posts</span></div><div className="stat-item"><span className="stat-num">{followers}</span><span className="stat-label">Followers</span></div><div className="stat-item"><span className="stat-num">{following}</span><span className="stat-label">Following</span></div></div>
    {!isOwnProfile&&<button className="create-post-btn profile-back-btn" onClick={()=>navigate("/explore")}>← Back to Explore</button>}
   </section>
   <div className="profile-tabs"><button className={`profile-tab ${activeTab==="posts"?"active":""}`} onClick={()=>setActiveTab("posts")}>POSTS</button>{isOwnProfile&&<button className={`profile-tab ${activeTab==="saved"?"active":""}`} onClick={()=>setActiveTab("saved")}>SAVED</button>}</div>
   {activeTab==="posts"&&(visiblePosts.length?<div className="profile-timeline">{visiblePosts.map(p=><PostCard key={p.id} post={p} onDeleted={id=>setPosts(prev=>prev.filter(p=>String(p.id)!==String(id)))}/>)}</div>:<div className="empty-state-card"><span><FaUserAstronaut/></span><h3>No broadcasts yet</h3><p>{isOwnProfile?"Your first post can start your story here.":"This user hasn't shared anything yet."}</p>{isOwnProfile&&<button className="create-post-btn" onClick={()=>navigate("/create")}>+ Create a post</button>}</div>)}
   {activeTab==="saved"&&(visiblePosts.length?<div className="profile-timeline">{visiblePosts.map(p=><PostCard key={p.id} post={p}/>)}</div>:<div className="empty-state-card"><span>♡</span><h3>No saved posts from this profile</h3><p>Save posts you love and revisit them whenever you want.</p><button className="create-post-btn" onClick={()=>navigate("/saved")}>Open your collection</button></div>)}
  </main></div>
  {editing&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setEditing(false)}}><section className="edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title"><div className="modal-titlebar"><span id="edit-profile-title">EDIT_IDENTITY.EXE</span><button onClick={()=>setEditing(false)} aria-label="Close"><FaTimes/></button></div><form onSubmit={saveProfile} className="edit-profile-form"><p className="section-subtitle">Make your corner of the grid feel like you.</p>{error&&<div className="auth-error">{error}</div>}<label>Display name<input className="create-input" value={form.fullName} maxLength={80} onChange={e=>setForm({...form,fullName:e.target.value})} required/></label><label>Username<input className="create-input" value={form.username} maxLength={30} onChange={e=>setForm({...form,username:e.target.value.replace(/\s/g,"")})} required/></label><label>Bio <span className="field-count">{form.bio.length}/500</span><textarea className="create-input create-textarea" value={form.bio} maxLength={500} placeholder="A little signal about you…" onChange={e=>setForm({...form,bio:e.target.value})}/></label><div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setEditing(false)}>Cancel</button><button type="submit" className="auth-submit" disabled={saving}><FaCheck/> {saving?"Saving…":"Save profile"}</button></div></form></section></div>}
 </div>;
}
export default Profile;
