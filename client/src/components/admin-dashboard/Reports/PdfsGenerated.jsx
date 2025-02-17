import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { FileText, Calendar } from "lucide-react";
import axios from "axios"
import { HOST } from "../../../utils/constants.js"

const DailyPdfsGenerated = () => {
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
    const fetchPdfData = async () => {
      if (!startDate || !endDate) return;

      try {
        setLoading(true);
        
        // Update API endpoint to accept date range
        const res = await axios.get(`${HOST}/api/reports/pdf-gen-range?startDate=${startDate}&endDate=${endDate}`, {
          credentials: 'include'
        });

        const data = res.data;

        const processedData = data.map((item, index) => ({
          name: item.name || "Unknown",
          pdfs: item.count || 0,
          color: COLORS[index % COLORS.length],
        }));

        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfData();
  }, [startDate, endDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-50 to-emerald-50 p-6 rounded-2xl shadow-xl"
    >
      <div className="flex flex-col justify-between items-center gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">PDFs Generated</h2>
        </div>

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
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{
                background: '#1E293B',
                color: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                border: 'none',
              }}
              itemStyle={{
                color: '#4CAF50',
                fontWeight: 'bold',
              }}
              labelStyle={{
                color: '#E2E8F0',
                fontWeight: '600',
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