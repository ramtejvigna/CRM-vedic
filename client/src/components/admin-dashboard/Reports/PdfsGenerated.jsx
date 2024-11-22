import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";
import { HOST } from "../../../utils/constants.js";
import { Clock, FileText } from "lucide-react";

const DailyPdfsGenerated = () => {
  const [chartData, setChartData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [timeRange, setTimeRange] = useState("today");
  const [loading, setLoading] = useState(true);

  const COLORS = [
    '#6A5ACD',   // Slate Blue
    '#4CAF50',   // Vibrant Green
    '#FF6B6B',   // Soft Red
    '#4ECDC4',   // Teal
    '#556270'    // Dark Slate Gray
  ];

  useEffect(() => {
    const fetchEmployeesAndPdfData = async () => {
      try {
        setLoading(true);
        
        // Fetch all employees first
        const employeesRes = await axios.get(`${HOST}/api/employees`, {
          withCredentials: true,
        });

        // Fetch PDF generation data
        const pdfRes = await axios.get(`${HOST}/api/reports/pdf-gen-today?range=${timeRange}`, {
          withCredentials: true,
        });

        // Create a map of PDF counts
        const pdfCountMap = pdfRes.data.reduce((acc, item) => {
          acc[item.employeeName] = item.count;
          return acc;
        }, {});

        // Process employee data with PDF counts
        const processedData = employeesRes.data.map((employee, index) => ({
          name: `${employee.firstName} ${employee.lastName}`,
          pdfs: pdfCountMap[`${employee.firstName} ${employee.lastName}`] || 0,
          color: COLORS[index % COLORS.length]
        }));

        setEmployeeList(employeesRes.data);
        setChartData(processedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeesAndPdfData();
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
          className="border-2 border-indigo-300 rounded-lg px-3 py-2 bg-white text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
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
            <XAxis 
              dataKey="name" 
              interval={0} 
              angle={-45} 
              textAnchor="end" 
              height={100} 
            />
            <YAxis />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.01)' }}
              contentStyle={{ 
                background: '#333', 
                color: 'white', 
                borderRadius: '10px' 
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