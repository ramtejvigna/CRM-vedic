import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import axios from "axios";
import { api } from "../../../utils/constants.js";

const RegionalPdfReport = () => {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState("this");
  const [loading, setLoading] = useState(true);
  const [showOthers, setShowOthers] = useState(false);
  const [othersData, setOthersData] = useState([]);
  const [totalPDFs, setTotalPDFs] = useState(0);

  const COLORS = {
    main: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'],
    others: '#6B7280'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${api}/api/reports/regional-distribution?timeRange=${timeRange}`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          const { mainRegions, otherRegions, othersTotal, totalPDFs } = res.data;
          
          const processedData = [
            ...mainRegions.map((d, index) => ({
              name: d.region,
              value: d.pdfCount,
              color: COLORS.main[index]
            }))
          ];

          if (othersTotal > 0) {
            processedData.push({
              name: 'Others',
              value: othersTotal,
              color: COLORS.others
            });
          }

          setChartData(processedData);
          setOthersData(otherRegions);
          setTotalPDFs(totalPDFs);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const percentage = ((data.value / totalPDFs) * 100).toFixed(1);

    return (
      <div className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700">
        <p className="text-white font-semibold text-lg">{data.name}</p>
        <div className="mt-2 space-y-1">
          <p className="text-white">{data.value.toLocaleString()} PDFs</p>
          <p className="text-gray-300">{percentage}% of total</p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-2xl shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Regional PDF Distribution</h2>
            <p className="text-gray-500 mt-1">Distribution of PDFs across different regions</p>
          </div>
          
          <div className="flex items-center gap-4">
            {othersData.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowOthers(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <span>View Other Regions</span>
                <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                  {othersData.length}
                </span>
              </motion.button>
            )}
            
            <motion.select
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border-2 border-indigo-300 rounded-lg px-4 py-2 bg-white text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="this">This Month</option>
              <option value="last">Last Month</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">This Year</option>
            </motion.select>
          </div>
        </div>

        {loading ? (
          <motion.div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-500" />
          </motion.div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-lg font-medium">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={140}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span className="text-gray-700 font-medium">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {chartData.map((item, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <h3 className="font-medium text-gray-700 truncate">{item.name}</h3>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500">
                  {((item.value / totalPDFs) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {showOthers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowOthers(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Other Regions</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Regions with less than 5% of total PDFs ({totalPDFs.toLocaleString()} total)
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOthers(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[60vh]">
                {othersData.map((region, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <span className="font-medium text-gray-700">{region.region}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-gray-900 font-semibold">{region.pdfCount.toLocaleString()}</span>
                        <span className="text-gray-500 text-sm ml-2">PDFs</span>
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-indigo-600 font-medium">{region.percentage}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegionalPdfReport;