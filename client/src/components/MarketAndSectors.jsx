/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../cssForComponents/MarketAndSectors.css";
import { ClipLoader } from "react-spinners";

function MarketAndSectors() {
  const [marketAndSectorsData, setMarketAndSectorsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from the server
  async function fetchData() {
    try {
      const response = await axios.get(
        "http://localhost:5000/market-and-sectors"
      );

      if (response.status === 200) {
        setMarketAndSectorsData(response.data);
        setError(null);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching market and sectors data:", err);
      setError("Error fetching data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  // Initial fetch and set up interval to fetch data every 1 second
  useEffect(() => {
    fetchData(); // Initial data fetch

    // Set up interval to fetch data every 20 second
    const intervalId = setInterval(fetchData, 20000);

    // Clean up interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Dependency array is empty, meaning effect runs only once on mount

  // Function to render each sector card
  const renderSectorCard = ({ name, data }) => (
    <div className="sector-card" key={name}>
      <h3 className="sector-title text-white">{name}</h3>
      {data.error ? (
        <p className="sector-error">Error: {data.error}</p>
      ) : (
        <>
          <p className="sector-price text-white">
            ₹{data.price.toLocaleString()}
          </p>{" "}
          <div
            className={`change-indicator ${
              data.change_bracketed_value > 0 ? "positive" : "negative"
            }`}
          >
            <span className="change-value">
              {data.change_bracketed_value.toFixed(2)}
            </span>
            <span className="percentage-change">
              ({data.percentage_change.toFixed(2)}%)
            </span>

            <span
              className={`arrow-icon fas ${
                data.change_bracketed_value > 0
                  ? "fa-arrow-up"
                  : "fa-arrow-down"
              }`}
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="market-and-sectors">
      <h2 className="marketTitle">Market and Sectors</h2>

      {/* Display loading spinner while data is being loaded */}
      {isLoading ? (
        <div className="loading-container">
          <ClipLoader color="#00c853" size={50} />
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        // Render rows of sector cards, three cards per row
        Object.entries(marketAndSectorsData)
          .reduce((result, [name, data], index) => {
            // Group data into arrays of three
            if (index % 3 === 0) {
              result.push([]);
            }
            result[Math.floor(index / 3)].push({ name, data });
            return result;
          }, [])
          .map((group, index) => (
            <div className="sector-row" key={index}>
              {group.map((item) => renderSectorCard(item))}
            </div>
          ))
      )}
    </div>
  );
}

export default MarketAndSectors;
