import React from "react";
import {
  Typography,
} from "@material-tailwind/react";
import { Statistics } from "../../cards";

import { StatisticsChart } from "../../charts";
import {
  statisticsChartsData,
} from "../../../data";
import { ClockIcon } from "@heroicons/react/24/solid";


export function Home() {
  return (
    <div className="mt-12">
      <div className="mb-12 ">
        <Statistics />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Home;