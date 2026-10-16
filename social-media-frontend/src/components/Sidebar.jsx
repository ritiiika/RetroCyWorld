import { FaHome, FaPlusSquare, FaUser, FaHashtag, FaBookmark } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";
const ITEMS = [
 { icon: <FaHome />, label: "HOME", path: "/feed" },
 { icon: <FaPlusSquare />, label: "POST", path: "/create" },
 { icon: <FaUser />, label: "PROFILE", path: "/profile" },
 { icon: <FaHashtag />, label: "EXPLORE", path: "/explore" },
 { icon: <FaBookmark />, label: "SAVED", path: "/saved" },
];
function Sidebar(){
 const navigate=useNavigate(); const {pathname}=useLocation();
 return <aside className="sidebar"><h2 className="sidebar-title">{"// MENU"}</h2>{ITEMS.map(item=>{const active=pathname===item.path || (item.path!=="/profile" && pathname.startsWith(item.path+"/")) || (item.path==="/profile" && pathname.startsWith("/profile"));return <button key={item.path} className={`menu ${active?"active":""}`} onClick={()=>navigate(item.path)}>{item.icon}{item.label}</button>})}<div className="sidebar-footnote"><span className="online-dot"/> GRID CONNECTION ACTIVE <small>RETROCYWORLD v1.0</small></div></aside>
}
export default Sidebar;
