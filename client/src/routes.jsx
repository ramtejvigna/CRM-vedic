import { MdSpaceDashboard } from "react-icons/md";
import { VscFileSubmodule } from "react-icons/vsc";
import { MdOutlineTaskAlt } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { BiSolidBabyCarriage, BiSolidCustomize } from "react-icons/bi";
import { GiExpense } from "react-icons/gi";
import { TiSocialInstagram } from "react-icons/ti";
import { AiOutlineFileDone } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { TbMoneybag } from "react-icons/tb";
import { GiThreeLeaves } from "react-icons/gi";

// Components
import Home from "./components/admin-dashboard/Home";
import EmployeeTable from "./components/admin-dashboard/Employee";
import ViewCustomers from "./components/admin-dashboard/Customer/ViewCustomers"; // Correctly imported ViewCustomers
import ViewExpenses from "./components/admin-dashboard/Expenses/ViewExpenses"; 

import Salaries from "./components/admin-dashboard/Salaries";
import TaskManagement from "./components/admin-dashboard/TaskManagement";
import Leaves from "./components/admin-dashboard/Leaves";
import BabyDatabase from "./components/admin-dashboard/BabyDatabase";
import PostForm from "./components/admin-dashboard/SocialMediaManagement";
import Settings from "./components/admin-dashboard/settings";
import Reports from "./components/admin-dashboard/Reports"
import Customers from "./components/admin-dashboard/Customers";
import CustomerTable from "./components/admin-dashboard/CustomerView";
import Customization from "./components/admin-dashboard/Customization";
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
    element: <Customers />,
  },
  {
    name: "task management",
    path: "tasks",
    icon: <MdOutlineTaskAlt {...icon} />,
    element: <TaskManagement />,
  },
  {
    name: "baby database",
    path: "babyDatabase",
    icon: <BiSolidBabyCarriage {...icon} />,
    element: <BabyDatabase />,
  },
  {
    name: "Social Media",
    path: "socialMediaManagement",
    icon: <TiSocialInstagram {...icon} />,
    element: <PostForm />
  },
  {
    name: "Customer's View",
    path: "customersView",
    icon:<FaUsers {...icon}/>,
    element: <CustomerTable />,
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
    element: <Reports />,
  },
  {
    name: "salaries",
    path: "salaries",
    icon: <TbMoneybag {...icon} />,
    element: <Salaries />,
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
    element: <Customization />,
  },
  {
    name: "settings",
    path: "settings",
    element: <Settings/>,
  },
];