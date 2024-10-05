import { BrowserRouter as Router, Routes, Route,Navigate} from "react-router-dom";

// admin-dashboard
import AdminDashboard from "./components/admin-dashboard";
function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/admin-dashboard/home"}/>} />
      <Route path="/admin-dashboard/*" element={<AdminDashboard/>}/>
    </Routes>
  );
}

export default App;
