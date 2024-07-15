/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import StockTicker from "./components/StockTicker";
import Nifty from "./components/Nifty";
import MarketAndSectors from "./components/MarketAndSectors";
// import StockChart from "./components/StockChart";
import axios from "axios"; // Import axios for making HTTP requests
import { mockCompanyDetails } from "./constants/mock";
import "./App.css";
import Dashboard from "./components/Dashboard";
import StockContext from "./context/StockContext";

const stocks = [
  "AAPL",
  "GOOGL",
  "META",
  "TSLA",
  "AMZN",
  "NFLX",
  "ADBE",
  "CRM",
  "WMT",
  "JNJ",
  "KO",
  "MA",
  "BAC",
  "INTC",
  "NKE",
  "SBUX",
  "F",
  "DIS",
  "IBM",
]; // Stock symbols

const API_BASE_URL = "https://api.allorigins.win/get?url=";
const INTERVAL = "1d";
const MAX_RETRIES = 5;

const App = () => {
  const [stockData, setStockData] = useState({});
  const [fetchError, setFetchError] = useState(false);
  const [stockSymbol, setStockSymbol] = useState("MSFT");

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const requests = stocks.map(async (stockSymbol) => {
          let retryCount = 0;
          let responseData = null;
          while (retryCount < MAX_RETRIES) {
            try {
              const apiUrl = `${API_BASE_URL}${encodeURIComponent(
                `https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}?interval=${INTERVAL}`
              )}`;
              const response = await axios.get(apiUrl);
              responseData = response.data.contents;
              break; // Break out of the retry loop if request is successful
            } catch (error) {
              console.error(`Error fetching data for ${stockSymbol}:`, error);
              retryCount++;
            }
          }
          if (!responseData) {
            throw new Error(`Failed to fetch data for ${stockSymbol}`);
          }
          return { [stockSymbol]: responseData };
        });

        const stockDataArray = await Promise.all(requests);
        const mergedStockData = Object.assign({}, ...stockDataArray);
        setStockData(mergedStockData);
        setFetchError(false); // Reset fetch error state if request succeeds
      } catch (error) {
        console.error("Error fetching stock dataa:", error);
        setFetchError(true);
        // Handle error
      }
    };

    const intervalId = setInterval(fetchStockData, 60000); // Fetch data every minute

    fetchStockData(); // Initial fetch

    return () => clearInterval(intervalId); // Cleanup interval
  }, []);

  return (
    <div>
      {fetchError ? (
        <p>Error fetching stock data. Please try again later.</p>
      ) : (
        <>
          {Object.keys(stockData).length > 0 && (
            <>
              <StockTicker stocks={stocks} stockData={stockData} />

              <Header />

              <Nifty />

              <MarketAndSectors />

              <StockContext.Provider value={{ stockSymbol, setStockSymbol }}>
                <Dashboard />
              </StockContext.Provider>
              {/* <StockChart /> */}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
