/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import Card from "./Card";
import "../cssForComponents/Overview.css";

const Overview = ({ symbol, price, change, changePercent, currency }) => {
  return (
    <Card>
      <span className="absolute left-4 top-2 text-neutral-400 text-lg">
        {symbol}
      </span>
      <div className="w-full h-full flex items-center justify-around">
        <span className="overviewPrice flex items-center gap-1">
          ${price}
          <span className="overviewCurrency">{currency}</span>
        </span>
        <span
          className={`overviewPercent ${
            change > 0 ? "text-lime-500" : "text-red-500"
          }`}
        >
          {change} <span>({changePercent}%)</span>
        </span>
      </div>
    </Card>
  );
};

export default Overview;
