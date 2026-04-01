// import './App.css'
// import Dashboard from './pages/dashboardPage/Dashboard'

// function App() {

//   return (
//     <>
//       {/* <Signup/> */}
//       {/* <Login/> */}
//       <Dashboard/>
//     </>
//   )
// }

// export default App


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/signUp/Signup";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboardPage/Dashboard";
import Upload from "./pages/uploadPage/UploadPage";
import VideoPlayer from "./pages/videoPlayer/VideoPlayer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup"      element={<Signup />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/upload"      element={<Upload />} />
        <Route path="/stream/:id"  element={<VideoPlayer />} />
        <Route path="/"            element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}