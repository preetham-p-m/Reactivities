import { BrowserRouter, Routes, Route } from "react-router-dom";
import Activity from "./components/Activity/Activity";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Activity />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;