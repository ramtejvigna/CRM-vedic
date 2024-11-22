import { useEffect, useState } from "react";
import { chartsConfig } from "../../../configs";
import { StatisticsChart } from "../../charts";
import axios from "axios";
import { HOST } from "../../../utils/constants.js";

function RevenueReport() {
  const [chartData, setChartData] = useState({
    type: "line", // Changed to line chart
    height: 250,
    series: [],
    options: {
      ...chartsConfig,
      chart: {
        background: "#9990FF",
        toolbar: {
          show: false,
        },
      },
      labels: [],
      legend: {
        position: "bottom",
        labels: {
          colors: "#FFFFFF",
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#FFFFFF"],
        },
      },
      tooltip: {
        theme: "dark",
      },
      xaxis: {
        categories: [],
      },
    },
  });

  const [timeRange, setTimeRange] = useState("monthly");
  const [employeeFilter, setEmployeeFilter] = useState("overall");
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch employees from the server
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${HOST}/api/employees`);
      setEmployees(response.data);
      console.log(response.data)
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch data based on selected filters
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const res = await axios.get(
          `${HOST}/api/reports/revenue?timeRange=${timeRange}&employeeFilter=${employeeFilter}`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          console.log(res.data);
          const categories = res.data.data.map((d) => d.label); 
          const revenueData = res.data.data.map((d) => d.totalRevenue); 
          setChartData((prev) => ({
            ...prev,
            series: [
              {
                name: "Revenue",
                data: revenueData,
              },
            ],
            options: {
              ...prev.options,
              xaxis: {
                categories, 
              },
            },
          }));
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRevenueData();
  }, [timeRange, employeeFilter]);
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const handleEmployeeChange = (e) => {
    setEmployeeFilter(e.target.value);
  };

  const timeRangeFilter = (
    <select
      value={timeRange}
      onChange={handleTimeRangeChange}
      className="border cursor-pointer border-gray-300 rounded-md px-2 py-1 text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly</option>
      <option value="weekly">Weekly</option>
    </select>
  );

  const employeeFilterComponent = (
    <select
      value={employeeFilter}
      onChange={handleEmployeeChange}
      className="border cursor-pointer text-black rounded-md px-2 py-1 text-xs bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="overall">Overall</option>
      {employees.map((employee) => (
        <option key={employee._id} value={employee._id}>
          {employee.firstName}
        </option>
      ))}
    </select>
  );

  return (
    <StatisticsChart
      filter={(
        <>
          {timeRangeFilter}
          {employeeFilterComponent}
        </>
      )}
      title="Revenue Report"
      color="blue"
      chart={chartData}
      description={`Revenue for the selected time range and employee (${
        timeRange === "this"
          ? new Intl.DateTimeFormat("en-US", { month: "long" }).format(
              new Date()
            )
          : timeRange === "last"
          ? new Intl.DateTimeFormat("en-US", { month: "long" }).format(
              new Date(new Date().setMonth(new Date().getMonth() - 1))
            )
          : timeRange === "yearly"
          ? new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(
              new Date()
            )
          : "This Week"
      })`}
    />
  );
}

export default RevenueReport;
