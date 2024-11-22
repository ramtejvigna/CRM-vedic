import { Card } from "@material-tailwind/react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { motion } from 'framer-motion';
import { useStore } from "../../store";

export function StatisticsChart({ color, chart, title, description, footer, filter }) {
  const { isDarkMode } = useStore();

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
    >
      {/* Text Content */}
      <div className="px-6 py-4 bg-opacity-10 backdrop-blur-sm flex flex-row justify-between items-center">
        <div>
          <h5 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
            {title}
          </h5>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
        <div>
          {/* Filter Container */}
          {filter && (
            <motion.div
              className="flex gap-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {filter}
            </motion.div>
          )}
        </div>
      </div>
      <Card
        className={`
          relative 
          rounded-xl 
          overflow-hidden 
          shadow-lg 
          transition-all 
          duration-300 
          hover:shadow-2xl
        `}
      >
        {/* Chart Container */}
        <div
          className="chart-container mx-auto transition-transform duration-300"
          style={{
            width: "100%",
            height: chart.height || "250px",
            borderRadius: "15px",
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}
        >
          <Chart {...chart} />
        </div>


      </Card>
    </motion.div>
  );
}

StatisticsChart.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsChart.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  chart: PropTypes.object.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  footer: PropTypes.node,
  filter: PropTypes.node, // Added prop type for the filter
};

StatisticsChart.displayName = "/src/widgets/charts/statistics-chart.jsx";

export default StatisticsChart;
