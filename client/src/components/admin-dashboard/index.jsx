import { routes } from "../../routes";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidenav from "../Sidebar";
import { useStore } from "../../store";
import Home from "./Home";
import AddEmployee from "./Employee/AddEmployee";
import TaskManagement from "./TaskManagement";
import EditEmployee from "./Employee/EditEmployee";
import Customer from "./Customer/Customer"; // Default import
import ViewEmployee from "./Employee/ViewEmployee";
import AddExpense from "./Expenses/AddExpense.jsx";
import Leaves from "./Leaves";
import AddSalariesStatements from "./Salaries/AddSalariesStatements";

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
            <Route path="customers/:id" element={<Customer />} /> {/* Ensure correct import */}
            <Route path="employees/view-employee/:id" element={<ViewEmployee />} />
            <Route path='/tasks' element={<TaskManagement />} />
            <Route path="/expenses/add-expense" element={<AddExpense />} />
            <Route path='/leaves' element={<Leaves />} />
            <Route path='/add-salaries' element={<AddSalariesStatements />} />

            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
