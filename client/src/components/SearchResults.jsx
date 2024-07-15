/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const SearchResults = ({ results }) => {
  return (
    <ul className="absolute top-10 border-none w-full rounded-md h-64 overflow-y-scroll bg-gray-800 border-neutral-200 custom-scrollbar">
      {results.map((item) => {
        return (
          <li
            key={item.symbol}
            className="cursor-pointer p-4 m-2 flex justify-between rounded-md hover:bg-gray-600"
          >
            <span>{item.symbol}</span>
            <span>{item.description}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default SearchResults;
