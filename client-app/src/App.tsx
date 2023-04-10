import { BrowserRouter, Routes, Route } from "react-router-dom";
import ActivityIndex from "./components/Activity/ActivityIndex";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ActivityIndex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;