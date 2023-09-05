import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import WorkspacePage from "./Pages/WorkspacePage";
import VideoInfo from "./Components/WorkspacepageComponents/VideoInfo";

function App() {
  return (
    // <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workspace/*" element={<WorkspacePage />} />
        <Route path="/workspace/:videoId" element={<VideoInfo />} />
      </Routes>
    </div>
    // </Router>
  );
}

export default App;
