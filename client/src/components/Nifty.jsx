/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making API requests
import "../cssForComponents/Nifty.css";

const Nifty = () => {
  // State to hold Nifty50 data
  const [nifty50Data, setNifty50Data] = useState({
    change: null,
    percentage_change: null,
    price: null,
    symbol: null,
  });

  // State for showing either price or percentage change
  const [showPrice, setShowPrice] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/market-and-sectors"
      ); // Replace with your API endpoint
      const marketAndSectorsData = response.data;
      const nifty50Data = marketAndSectorsData["Nifty 50"];

      // Update state with the latest Nifty50 data
      setNifty50Data({
        change: nifty50Data.change_bracketed_value,
        percentage_change: nifty50Data.percentage_change,
        price: nifty50Data.price,
        symbol: nifty50Data.symbol,
      });
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch data from API");
      setLoading(false);
    }
  };

  // Initial data fetch and interval setup
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000); // Fetch every minute

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Toggle between price and percentage change every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowPrice((prev) => !prev);
    }, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="nifty">
      <div className="price-card">
        <h3 className="price-title">NIFTY50</h3>

        {loading ? (
          <p className="price">Loading...</p>
        ) : error ? (
          <p className="price">{error}</p>
        ) : showPrice ? (
          <p className="price">₹{nifty50Data?.price}</p>
        ) : (
          <div className="percentage-container">
            <span
              className={`percentage ${
                parseFloat(nifty50Data.percentage_change) > 0
                  ? "positive"
                  : "negative"
              }`}
            >
              {parseFloat(nifty50Data.percentage_change).toFixed(2)}%
            </span>
            {parseFloat(nifty50Data.percentage_change) > 0 ? (
              <span className="arrow-up">&#9650;</span>
            ) : (
              <span className="arrow-down">&#9660;</span>
            )}
          </div>
        )}
      </div>

      {/* SENSEX data */}
      <div className="price-card">
        <h3 className="price-title">SENSEX</h3>
        <p className="price">Data not available</p>
      </div>
    </div>
  );
};

export default Nifty;
