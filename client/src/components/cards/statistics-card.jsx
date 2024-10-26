import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CurrencyRupeeIcon,
  UsersIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

import PropTypes from "prop-types";

export function StatisticsCard({ color, icon, title, value, footer }) {
  return (
    <Card className={`relative border border-blue-gray-100 shadow-lg -translate-y-4`}>
      {/* Floating Container */}
      <div className={`absolute top-[-1rem] left-4 ${color} p-5 rounded-2xl flex items-center justify-center shadow-lg`}>
        {icon}
      </div>
      <CardBody className="p-4 text-right">
        <Typography variant="small" className="font-normal opacity-70">
          {title}
        </Typography>
        <Typography variant="h4" color="blue-gray" className="font-bold">
          {value}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t p-4 opacity-70">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

StatisticsCard.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsCard.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  footer: PropTypes.node,
};

export function Statistics() {
  const [statistics, setStatistics] = useState({
    revenue: "$0",
    customersToday: "0",
    pdfsGeneratedToday: "0",
    totalEmployees: "0",
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('https://vedic-backend-neon.vercel.app/statistics');
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
    fetchStatistics();
  }, []);

  const statisticsCardsData = [
    {
      color: "bg-[#303030]",
      icon: <CurrencyRupeeIcon className="h-8 w-8 text-white" />,
      title: "Today's Revenue",
      value: statistics.revenue,
      footer: (
        <span className="text-green-500">
          +55% <span className="font-normal opacity-70">than last week</span>
        </span>
      ),
    },
    {
      color: "bg-blue-500",
      icon: <UsersIcon className="h-8 w-8 text-white" />,
      title: "Today's customers",
      value: statistics.customersToday,
      footer: (
        <span className="text-green-500">
          +3% <span className="font-normal opacity-70">than last month</span>
        </span>
      ),
    },
    {
      color: "bg-green-500",
      icon: <DocumentTextIcon className="h-8 w-8 text-white" />,
      title: "PDFs generated Today",
      value: statistics.pdfsGeneratedToday,
      footer: (
        <span className="text-red-500">
          -2% <span className="font-normal opacity-70">than yesterday</span>
        </span>
      ),
    },
    {
      color: "bg-pink-500",
      icon: <ClipboardDocumentListIcon className="h-8 w-8 text-white" />,
      title: "Total Employees",
      value: statistics.totalEmployees,
      footer: (
        <span className="text-green-500">
          +5% <span className="font-normal opacity-70">than yesterday</span>
        </span>
      ),
    },
  ];

  return (
    <div className="grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
      {statisticsCardsData.map((data, index) => (
        <StatisticsCard
          key={index}
          color={data.color}
          icon={data.icon}
          title={data.title}
          value={data.value}
          footer={data.footer}
        />
      ))}
    </div>
  );
}

export default Statistics;
