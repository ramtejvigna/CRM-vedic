import { Card, CardBody, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { useStore } from "../../store";

export function StatisticsChart({ color, chart, title, description, footer, filter }) {
  const { isDarkMode } = useStore();

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Chart Card */}
      <Card
        className={`relative border border-blue-gray-100 shadow-lg w-full ${
          isDarkMode ? "bg-black text-white" : "bg-white"
        }`}
      >
        {/* Filter Container */}
        {filter && (
          <div className="absolute top-4 flex gap-5 right-8 z-10">
            {filter}
          </div>
        )}

        {/* Chart Container */}
        <div
          className="chart-container mx-auto a"
          style={{
            width: "90%",
            height: "250px",
            marginTop: "10px",
            borderRadius: "15px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Chart {...chart} />
        </div>

        {/* Text Content */}
        <div className="border px-6 pt-2 min-h-24">
          <div variant="h5" color="blue-gray" className="font-semibold">
            {title}
          </div>

          <Typography variant="small" className="font-normal text-blue-gray-600 mb-4">
            {description}
          </Typography>
        </div>
      </Card>
    </div>
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
