/* eslint-disable no-unused-vars */
import React from "react";
import Overview from "./Overview";
import Details from "./Details";
import { mockCompanyDetails } from "../constants/mock";
import Card from "./Card";
import "../cssForComponents/Dashboard.css";
import Chart from "./Chart";

const Dashboard = () => {
  return (
    <div className="chart">
      <h1 className="StockTitle">Stock Name</h1>
      <div
        className={`chart h-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 font-quicksand`}
      >
        <div className="md:col-span-2 row-span-4">
          <Chart />
        </div>
        <div className="overviewBox">
          <Overview
            symbol={mockCompanyDetails.ticker}
            price={310}
            change={30}
            changePercent={10.0}
            currency={"USD"}
          />
        </div>
        <div className="row-span-2 xl:row-span-3">
          <Details details={mockCompanyDetails} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
