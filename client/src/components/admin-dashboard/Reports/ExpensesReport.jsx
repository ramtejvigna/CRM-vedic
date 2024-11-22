import { useEffect, useState } from "react";
import { chartsConfig } from "../../../configs";
import { StatisticsChart } from "../../charts";
import axios from "axios";
import {HOST} from "../../../utils/constants.js"

function ExpensesReport() {
    const [chartData, setChartData] = useState({
        type: "pie", 
        height: 280, 
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
        },
      });
      
      const [timeRange, setTimeRange] = useState("this");

      useEffect(() => {
        const expensesThisMonth = async () => {
            try {
                const res = await axios.get(`${HOST}/api/reports/month-expenses?month=${timeRange}` , {withCredentials : true});

                if(res.status === 200) {
                    console.log(res.data)
                    const categories = res.data.map((d) => d.category);
                    const data = res.data.map((d) => d.totalAmount)
                    setChartData((prev) => ({
                        ...prev ,
                        series : data,
                        options : {
                            ...prev.options ,
                            labels : categories
                        }
                    }))
                }
            } catch (error) {
                console.log(error.message)
            }
        }

        expensesThisMonth()
      } , [timeRange]);


      const handleFilterChange = (e) => {
        setTimeRange(e.target.value);
      };

      const filterComponent = (
        <select
          value={timeRange}
          onChange={handleFilterChange}
          className="border cursor-pointer border-gray-300 rounded-md px-2 py-1 text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="this">This Month</option>
          <option value="last">Last Month</option>
        </select>
      );

  return (
    <StatisticsChart filter={filterComponent} title="Expeneses this month" color="blue" chart={chartData} description={`These are the expenses spent for the selected time range (${
      timeRange === "this"
        ? new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date())
        : new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(new Date().setMonth(new Date().getMonth() - 1)))
    })`}
     />
  )
}

export default ExpensesReport;