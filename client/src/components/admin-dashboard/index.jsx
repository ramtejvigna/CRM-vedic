import { routes } from "../../routes";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidenav from "../Sidebar";
import { useStore } from "../../store";
import Home from "./Home";
import AddEmployee from "./Employee/AddEmployee";
import TaskManagement from "./TaskManagement";
import EditEmployee from "./Employee/EditEmployee";
import ViewEmployee from "./Employee/ViewEmployee";
import AddExpense from "./Expenses/AddExpense.jsx";
import Leaves from "./Leaves";
import Customers from "./Customers/index.jsx";
import AddSalariesStatements from "./Salaries/AddSalariesStatements";
// import { VoiceRecognition } from "./VoiceRecognition.jsx";
import VoiceRecognition from './Voice2.jsx'
import CheckBoxListPage from "./Customer/CheckBoxList.jsx";
import Customer from "./Customers/Customer.jsx";
// import {VoiceRecognition} from './VoiceRecognition.jsx'
const AdminDashboard = () => {
  const { activeRoute, isDarkMode } = useStore();

  return (
    <div className={`h-screen ${isDarkMode ? "bg-black" : "bg-slate-50"} overflow-hidden flex`}>
      {/* Sidebar */}
      <Sidenav routes={routes} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col p-4 w-full overflow-auto">
        {/* Render the Dashboard Navbar */}
        <Navbar />
        <div className="flex-1">
          <Routes>
            {/* Map through main routes */}
            {routes.map((route, index) => (
              <Route
                key={index}
                path={`/${route.path}`}
                element={route?.element}
              />
            ))}
            <Route path="employees/add-employee" element={<AddEmployee />} />
            <Route path="employees/edit-employee/:id" element={<EditEmployee />} />
            <Route path="customers/:id" element={<Customers />} /> {/* Ensure correct import */}
            <Route path="customers/:id/generate-pdf" element={<CheckBoxListPage />} />
            <Route path="employees/view-employee/:id" element={<ViewEmployee />} />
            <Route path='/tasks' element={<TaskManagement />} />
            <Route path="/expenses/add-expense" element={<AddExpense />} />
            <Route path='/leaves' element={<Leaves />} />
            <Route path='/salaries/add-salaries' element={<AddSalariesStatements />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/customers/viewDetailsIn" element={<Customer />} />
            <Route path="/customers/viewDetailsIn/generate-pdf" element={<CheckBoxListPage />} />
          </Routes>
        </div>
        <VoiceRecognition/>
      </div>
    </div>
  );
};

export default AdminDashboard;