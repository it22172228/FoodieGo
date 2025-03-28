import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sample from "./pages/sample";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Sample />} />
      </Routes>
    </Router>
  );
}

export default App;
