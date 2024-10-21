import { MdSpaceDashboard } from "react-icons/md";
import { FaNetworkWired } from "react-icons/fa";
import { VscFileSubmodule } from "react-icons/vsc";
import { MdOutlineTaskAlt } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { BiSolidBabyCarriage, BiSolidCustomize } from "react-icons/bi";
import { GiExpense } from "react-icons/gi";
import { AiOutlineFileDone } from "react-icons/ai";
import { TbMoneybag } from "react-icons/tb";
import { GiThreeLeaves } from "react-icons/gi";

// Components
import Home from "./components/admin-dashboard/Home";
import { EmployeeTable } from "./components/admin-dashboard/Employee";
import ViewCustomers from "./components/admin-dashboard/Customer/ViewCustomers"; // Correctly imported ViewCustomers
import ViewExpenses from "./components/admin-dashboard/Expenses/ViewExpenses"; 

import TaskManagement from "./components/admin-dashboard/TaskManagement";
import Leaves from "./components/admin-dashboard/Leaves";
const Component = ({ name }) => {
  return (
    <>
      {name}
    </>
  );
};

const icon = {
  className: "text-xl",
};

export const routes = [
  {
    name: "dashboard",
    path: "home",
    icon: <MdSpaceDashboard className="text-xl" />,
    element: <Home />,
  },
  {
    name: "employees",
    icon: <AiOutlineFileDone {...icon} />,
    path: "employees",
    element: <EmployeeTable />,
  },
  {
    name: "customers",
    path: "customers",
    icon: <VscFileSubmodule {...icon} />,
    element: <ViewCustomers />,
  },
  {
    name: "task management",
    path: "tasks",
    icon: <MdOutlineTaskAlt {...icon} />,
    element: <TaskManagement />,
  },
  {
    name: "baby database",
    path: "baby",
    icon: <BiSolidBabyCarriage {...icon} />,
    element: <Home />,
  },
  {
    name: "work day calculation",
    path: "work-day",
    icon: <FaNetworkWired {...icon} />,
    element: <Home />,
  },
  {
    name: "leave management",
    path: "leave",
    icon: <GiThreeLeaves {...icon} />,
    element: <Leaves />,
  },
  {
    name: "reports",
    path: "reports",
    icon: <TbReportAnalytics {...icon} />,
    element: <Home />,
  },
  {
    name: "salaries",
    path: "salaries",
    icon: <TbMoneybag {...icon} />,
    element: <Home />,
  },
  {
    name: "expenses",
    path: "expenses",
    icon: <GiExpense {...icon} />,
    element: <ViewExpenses />,
  },
  {
    name: 'customization',
    path: "customize",
    icon: <BiSolidCustomize {...icon} />,
    element: <Home />,
  },
  {
    name: "settings",
    path: "settings",
    element: <Component name={"settings"} />,
  },
];