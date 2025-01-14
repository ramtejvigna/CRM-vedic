import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";
import { HOST } from "../../../utils/constants.js";
import { FileText } from "lucide-react";

const DailyPdfsGenerated = () => {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState("today");
  const [loading, setLoading] = useState(true);

  const COLORS = [
    "#6A5ACD", // Slate Blue
    "#4CAF50", // Vibrant Green
    "#FF6B6B", // Soft Red
    "#4ECDC4", // Teal
    "#556270", // Dark Slate Gray
    "#FFA500", // Orange
    "#2E8B57", // Sea Green
  ];

  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        setLoading(true);

        // Fetch combined employee and admin data
        const res = await axios.get(`${HOST}/api/reports/pdf-gen-today?range=${timeRange}`, {
          withCredentials: true,
        });

        console.log("API Response:", res.data);

        // Process the response to format for the chart
        const processedData = res.data.map((item, index) => ({
          name: item.name || "Unknown", // Fallback for missing names
          pdfs: item.count || 0, // Fallback for missing counts
          color: COLORS[index % COLORS.length], // Assign colors cyclically
        }));

        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfData();
  }, [timeRange]);

  const handleFilterChange = (e) => {
    setTimeRange(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-50 to-emerald-50 p-6 rounded-2xl shadow-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <FileText className="text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">PDFs Generated</h2>
        </div>

        <motion.select
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          value={timeRange}
          onChange={handleFilterChange}
          className="border-2 border-indigo-300 rounded-lg px-3 py-2 bg-white text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="today">Today</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </motion.select>
      </div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
        </motion.div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{
                background: '#1E293B', // Dark blue-gray background
                color: 'white',        // White text color
                borderRadius: '8px',   // Rounded corners
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Subtle shadow for depth
                border: 'none',        // Remove border
              }}
              itemStyle={{
                color: '#4CAF50', // Golden text for data labels
                fontWeight: 'bold', // Bold text
              }}
              labelStyle={{
                color: '#E2E8F0', // Light gray text for the label
                fontWeight: '600', // Slightly bold text
              }}
            />

            <Bar dataKey="pdfs" name="PDFs">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default DailyPdfsGenerated;
