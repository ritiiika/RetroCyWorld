import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Feed       from "./pages/Feed";
import Profile    from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Explore from "./pages/Explore";
import Saved from "./pages/Saved";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Login />}      />
        <Route path="/register"    element={<Register />}   />
        <Route path="/feed"        element={<Feed />}       />
        <Route path="/profile"     element={<Profile />}    />
        <Route path="/profile/:id" element={<Profile />}    />
        <Route path="/create"      element={<CreatePost />} />
        <Route path="/explore"     element={<Explore />} />
        <Route path="/saved"       element={<Saved />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
