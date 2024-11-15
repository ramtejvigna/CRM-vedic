import { BrowserRouter as Router, Routes, Route,Navigate} from "react-router-dom";
import {toast} from "react-toastify"
import axios from "axios"
import {HOST} from './utils/constants.js'
// admin-dashboard
import AdminDashboard from "./components/admin-dashboard";
import { useStore } from "./store";
import Login from "./pages/Login";
import { useEffect } from "react";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const PrivateRoute = ({children}) => {
  const {adminInfo} = useStore();
  return !!adminInfo ? children : <Navigate to={"/login"} />
}
const AuthRoute = ({children}) => {
  const {adminInfo} = useStore();
  console.log(adminInfo)
  return !!adminInfo ? <Navigate to={"/admin-dashboard/home"} /> : children ;
}


function App() {

  const {adminInfo , setAdminInfo} = useStore();

  useEffect(() => {
    const getAdminInfo = async () => {
  
      try {
        const response = await axios.get(`${HOST}/admin/auth/check-auth`, { withCredentials: true });

        if(response.status === 200) {
          setAdminInfo(response.data.admin)
        } 
    
      } catch (error) {
        console.log(error.message)
      } 
    };

    if(!adminInfo) {
      getAdminInfo();
    }

  } , [adminInfo , setAdminInfo] )

  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/admin-dashboard/home"}/>} />
      <Route path="/admin-dashboard/*" element={<PrivateRoute><AdminDashboard/></PrivateRoute>}/>
      <Route path="/login" element={<AuthRoute><Login/></AuthRoute>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password/:token" element={<ResetPassword/>}/>
    </Routes>
  );
}

export default App;
