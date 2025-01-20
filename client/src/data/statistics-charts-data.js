import { chartsConfig } from "../configs";

// Create initial empty charts for customer requests and PDFs
const createEmptyChart = (type, color) => ({
  type: "line",
  height: 220,
  series: [
    {
      name: type === "customers" ? "Requests" : "PDFs",
      data: [],
    },
  ],
  options: {
    ...chartsConfig,
    chart: {
      background: color,
      toolbar: { show: false },
    },
    colors: ["#FFFFFF"],
    stroke: {
      lineCap: "round",
      width: 2,
    },
    markers: {
      size: 5,
    },
    xaxis: {
      categories: [],
      labels: {
        style: { colors: "#FFFFFF" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#FFFFFF" },
      },
    },
    grid: {
      show: true,
      borderColor: "rgba(255, 255, 255, 0.3)",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
  },
});

// Create empty social media chart
const createEmptySocialMediaChart = () => ({
  type: "bar",
  height: 220,
  series: [
    {
      name: "Leads",
      data: [],
    },
  ],
  options: {
    ...chartsConfig,
    chart: {
      background: "#1E90FF",
      toolbar: { show: false },
    },
    colors: ["#FFFFFF"],
    plotOptions: {
      bar: {
        columnWidth: "20%",
        borderRadius: 5,
      },
    },
    xaxis: {
      categories: [],
      labels: {
        style: { colors: "#FFFFFF" },
        rotate: -45,
        maxHeight: 60
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#FFFFFF" },
      },
    },
    grid: {
      show: true,
      borderColor: "rgba(255, 255, 255, 0.3)",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: true } },
    },
  },
});

// Initial empty charts
const socialMediaChart = createEmptySocialMediaChart();
const customerRequestsChart = createEmptyChart("customers", "#28a745");
const pdfGeneratedChart = createEmptyChart("pdfs", "#333333");

// Function to update charts with API data
export const updateChartsWithData = (apiData) => {
  const { dayLabels, customerData, pdfData, socialMediaData } = apiData;

  // Update social media chart
  const updatedSocialMediaChart = {
    ...socialMediaChart,
    series: [{ ...socialMediaChart.series[0], data: socialMediaData.values }],
    options: {
      ...socialMediaChart.options,
      xaxis: {
        ...socialMediaChart.options.xaxis,
        categories: socialMediaData.labels,
      },
    },
  };

  // Create new chart objects with updated data
  const updatedCustomerChart = {
    ...customerRequestsChart,
    series: [{ ...customerRequestsChart.series[0], data: customerData }],
    options: {
      ...customerRequestsChart.options,
      xaxis: {
        ...customerRequestsChart.options.xaxis,
        categories: dayLabels,
      },
    },
  };

  const updatedPdfChart = {
    ...pdfGeneratedChart,
    series: [{ ...pdfGeneratedChart.series[0], data: pdfData }],
    options: {
      ...pdfGeneratedChart.options,
      xaxis: {
        ...pdfGeneratedChart.options.xaxis,
        categories: dayLabels,
      },
    },
  };

  // Return the full array of charts
  return [
    {
      color: "blue",
      title: "Social Media Lead Sources",
      description: "Last week's customer requests by lead source",
      chart: updatedSocialMediaChart,
    },
    {
      color: "green",
      title: "Customer Requests",
      description: "Last 7 days of customer requests",
      chart: updatedCustomerChart,
    },
    {
      color: "black",
      title: "Generated PDFs",
      description: "Last 7 days of generated PDFs",
      chart: updatedPdfChart,
    },
  ];
};

// Export initial data for first render
export const statisticsChartsData = [
  {
    color: "blue",
    title: "Social Media Lead Sources",
    description: "Last week's customer requests by lead source",
    chart: socialMediaChart,
  },
  {
    color: "green",
    title: "Customer Requests",
    description: "Last 7 days of customer requests",
    chart: customerRequestsChart,
  },
  {
    color: "black",
    title: "Generated PDFs",
    description: "Last 7 days of generated PDFs",
    chart: pdfGeneratedChart,
  },
];

export default statisticsChartsData;