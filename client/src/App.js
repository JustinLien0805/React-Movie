import "./App.css";
import SignUp from "./components/Form/SignUp";
import Login from "./components/Form/Login";
import Home from "./components/Home/Home";
import Detail from "./components/Detail/Detail";
import { Routes, Route } from "react-router-dom";
import { AdminContext } from "./components/Helper/Context";
import { useState } from "react";

function App() {
  const [admin, setAdmin] = useState();
  return (
    <div className="App">
      <AdminContext.Provider value={[admin, setAdmin]}>
        <Routes>
          <Route path="/movie" element={<Home />} />
          <Route path="/detail/:movieid" element={<Detail />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </AdminContext.Provider>
    </div>
  );
}

export default App;
