import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import axios from "axios";
import { HOST } from "../../../utils/constants.js";

const ExpensesReport = () => {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState("this");
  const [loading, setLoading] = useState(true);

  const COLORS = [
    '#6A5ACD',   // Slate Blue
    '#4CAF50',   // Vibrant Green
    '#FF6B6B',   // Soft Red
    '#4ECDC4',   // Teal
    '#556270'    // Dark Slate Gray
  ];

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${HOST}/api/reports/month-expenses?month=${timeRange}`, { withCredentials: true });
        
        if (res.status === 200) {
          const processedData = res.data.map((d, index) => ({
            name: d.category,
            value: d.totalAmount,
            color: COLORS[index % COLORS.length]
          }));
          setChartData(processedData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [timeRange]);

  const handleFilterChange = (e) => {
    setTimeRange(e.target.value);
  };

  const monthName = timeRange === "this" 
    ? new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date())
    : new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(new Date().setMonth(new Date().getMonth() - 1)));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-50 to-emerald-50 p-6 rounded-2xl shadow-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Expenses: {monthName}</h2>
        
        <motion.select
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          value={timeRange}
          onChange={handleFilterChange}
          className="border-2 border-indigo-300 rounded-lg px-3 py-2 bg-white text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="this">This Month</option>
          <option value="last">Last Month</option>
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
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                background: '#333', 
                color: 'white', 
                borderRadius: '10px' 
              }}
              itemStyle={{ color: 'white' }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default ExpensesReport;