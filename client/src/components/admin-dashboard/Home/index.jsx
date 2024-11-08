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
          />
        ))}
      </div>
    </div>
  );
}

export default Home;