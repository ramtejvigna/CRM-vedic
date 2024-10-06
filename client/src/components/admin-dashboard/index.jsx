import { routes } from "../../routes";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidenav from "../Sidebar";
import { useStore } from "../../store";
import Home from "./Home";
import AddEmployee from "./Employee/AddEmployee";
import TaskManagement from "./TaskManagement";

import EditEmployee from "./Employee/EditEmployee";
import { Customer } from "./Customer/Customer";
const AdminDashboard = () => {
  const { activeRoute, isDarkMode } = useStore();

  return (
    <div className={`h-screen ${isDarkMode ? "bg-black" : "bg-slate-50"} overflow-hidden flex`}>
      {/* Sidebar */}
      <Sidenav routes={routes} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col  p-4 w-full overflow-auto">
        {/* Render the Dashboard Navbar */}
        <Navbar />
        <div className="flex-1 ">
          <Routes>
            {/* Map through main routes */}
            {routes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={`/${route.path}`}
                  element={route?.element}
                />
              )
            })}
            <Route path="employees/add-employee" element={<AddEmployee />} />
            <Route path="employees/edit-employee/:id" element={<EditEmployee/>}/>
            <Route path="customers/:username" element={<Customer />} />
            {/* Default route to redirect to the home */}
            <Route path='/tasks' element={<TaskManagement/>}/>
            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
