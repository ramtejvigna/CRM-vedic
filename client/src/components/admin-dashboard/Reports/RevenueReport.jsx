import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chartsConfig } from "../../../configs";
import { StatisticsChart } from "../../charts";
import axios from "axios";
import { HOST } from "../../../utils/constants.js";

function RevenueReport() {
  const [chartData, setChartData] = useState({
    type: "bar", 
    height: 400,
    series: [],
    options: {
      ...chartsConfig,
      chart: {
        background: "#C9E6F0",
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 5,
          dataLabels: {
            position: 'top'
          }
        },
      },
      legend: {
        position: "bottom",
        labels: { colors: "#FFFFFF" },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: { 
          colors: ["#FFFFFF"],
          fontSize: '12px',
          fontWeight: 'bold'
        }
      },
      tooltip: { 
        theme: "dark",
        fillSeriesColor: true,
        style: {
          fontSize: '12px',
          fontFamily: undefined
        }
      },
      xaxis: { 
        categories: [],
        tickPlacement: 'between',
        crosshairs: {
          show: true,
          width: 1,
          position: 'back',
          opacity: 0.9,
          stroke: {
            color: '#b6b6b6',
            width: 1,
            dashArray: 3
          }
        }
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
      className="border cursor-pointer border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      className="border cursor-pointer text-black rounded-md px-2 py-1 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-white rounded-lg shadow-md"
    >
      <StatisticsChart
        filter={(
          <motion.div 
            className="flex space-x-4 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <select
                value={timeRange}
                onChange={handleTimeRangeChange}
                className="border cursor-pointer border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
              </select>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <select
                value={employeeFilter}
                onChange={handleEmployeeChange}
                className="border cursor-pointer text-black rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="overall">Overall</option>
                <AnimatePresence>
                  {employees.map((employee) => (
                    <motion.option 
                      key={employee._id} 
                      value={employee._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {employee.firstName}
                    </motion.option>
                  ))}
                </AnimatePresence>
              </select>
            </motion.div>
          </motion.div>
        )}
        title="Revenue Report"
        color="blue"
        chart={chartData}
        description={`Revenue for the selected time range and employee`}
      />
    </motion.div>
  );
}

export default RevenueReport;