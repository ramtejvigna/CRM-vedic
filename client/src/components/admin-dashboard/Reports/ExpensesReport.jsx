import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Calendar } from "lucide-react";
import EmptyStateExpenses from "./EmptyStateExpenses.jsx";
import axios from "axios";
import { HOST } from "../../../utils/constants.js";

const ExpensesReport = () => {
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  const COLORS = [
    '#6A5ACD',   // Slate Blue
    '#4CAF50',   // Vibrant Green
    '#FF6B6B',   // Soft Red
    '#4ECDC4',   // Teal
    '#556270'    // Dark Slate Gray
  ];

  useEffect(() => {
    // Set default date range to current month
    if (!startDate && !endDate) {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
      setEndDate(lastDayOfMonth.toISOString().split('T')[0]);
    }
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!startDate || !endDate) return;

      try {
        setLoading(true);
        const res = await axios.get(`${HOST}/api/reports/range-expenses?startDate=${startDate}&endDate=${endDate}`, {
          credentials: 'include'
        });
        const data = res.data;

        const processedData = data.map((d, index) => ({
          name: d.category,
          value: d.totalAmount,
          percentage: d.percentage,
          color: COLORS[index % COLORS.length]
        }));
        
        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [startDate, endDate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <p className="text-white font-semibold">{data.name}</p>
          <p className="text-green-400">{formatCurrency(data.value)}</p>
          <p className="text-gray-300">{data.percentage.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-50 to-emerald-50 p-6 rounded-2xl shadow-xl"
    >
      <div className="flex flex-col justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Expenses Report</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-indigo-600 w-5 h-5" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-2 border-indigo-300 rounded-lg px-3 py-2 bg-white text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="flex items-center gap-2">
            <Calendar className="text-indigo-600 w-5 h-5" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-2 border-indigo-300 rounded-lg px-3 py-2 bg-white text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
        </motion.div>
      ) : chartData.length === 0 ? (
        <EmptyStateExpenses />
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
            <Tooltip content={customTooltip} />
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