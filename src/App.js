import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import WorkspacePage from "./Pages/WorkspacePage";

function App() {
  return (
    // <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workspaces" element={<WorkspacePage />} />
      </Routes>
    </div>
    // </Router>
  );
}

export default App;
