import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Room from "./components/Room";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  useEffect(() => {});
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/room/:roomId" element={<Room />}></Route>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
