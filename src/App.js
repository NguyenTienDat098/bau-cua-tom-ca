import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { UserContext } from "./providers/User";

function App() {
  const UserData = useContext(UserContext);
  const { user } = UserData;
  console.log(user);
  if (user !== undefined && user.userName) {
    return (
      <div className="App">
        <Home />
      </div>
    );
  }
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
