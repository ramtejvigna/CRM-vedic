import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { Statistics } from "../../cards";
import { StatisticsChart } from "../../charts";
import { updateChartsWithData } from "../../../data/statistics-charts-data";
import { ClockIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { api } from "../../../utils/constants";

export function Home() {
  const [chartsData, setChartsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeeklyStats();
  }, []);

  const fetchWeeklyStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/api/home/weekly-stats`); 
      console.log(response)
      // Adjust the endpoint as per your API route
      const data = await response.data;
      
      if (data.success) {
        // Update charts with the new data
        const updatedCharts = updateChartsWithData(data.data);
        setChartsData(updatedCharts);
      } else {
        setError("Failed to fetch statistics");
      }
    } catch (err) {
      setError("Error loading statistics: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="mb-12">
        <Statistics />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {chartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;