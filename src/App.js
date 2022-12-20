import Login from './pages/Login';
import Registration from './pages/Registration';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="registration" element={<Registration />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
