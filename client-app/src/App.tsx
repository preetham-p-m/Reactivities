import { BrowserRouter, Routes, Route } from "react-router-dom";
import ActivityMain from "./components/Activity/ActivityMain";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ActivityMain />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;