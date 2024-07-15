/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from "react";
import "../cssForComponents/StockTicker.css"; // Import CSS file for styling

const StockTicker = ({ stocks, stockData }) => {
  const tickerRef = useRef(null);

  useEffect(() => {
    const tickerElement = tickerRef.current;
    const tickerList = tickerElement.querySelector("ul");
    const tickerItems = tickerList.querySelectorAll("li");

    const totalWidth = Array.from(tickerItems).reduce(
      (acc, item) => acc + item.offsetWidth,
      0
    );
    tickerList.style.width = `${totalWidth}px`;

    function resetTicker() {
      tickerList.style.transition = "none";
      tickerList.style.transform = "translateX(0)";
      void tickerList.offsetWidth; // Force reflow
      tickerList.style.transition = ""; // Re-enable transition
      requestAnimationFrame(() => {
        tickerList.style.transform = `translateX(-${totalWidth}px)`;
      });
    }

    // Reset the ticker when animation ends
    tickerList.addEventListener("animationiteration", resetTicker);

    // Clean up event listener
    return () => {
      tickerList.removeEventListener("animationiteration", resetTicker);
    };
  }, [stocks]);

  // Mapping of stock symbols to full names
  const stockNames = {
    AAPL: "Apple",
    GOOGL: "Alphabet",
    META: "Meta Platforms",
    TSLA: "Tesla",
    AMZN: "Amazon",
    NFLX: "Netflix",
    ADBE: "Adobe",
    CRM: "Salesforce",
    WMT: "Walmart",
    JNJ: "Johnson & Johnson",
    KO: "Coca-Cola",
    MA: "Mastercard",
    BAC: "Bank of America Corporation",
    INTC: "Intel",
    NKE: "Nike",
    SBUX: "Starbucks",
    F: "Ford-Motor",
    DIS: "Disney",
    IBM: "IBM",
  };

  // Duplicate the stocks for continuous scrolling
  const duplicatedStocks = [...stocks, ...stocks];

  return (
    <div className="stock-ticker" ref={tickerRef}>
      <ul>
        {duplicatedStocks.map((stock, index) => {
          const stockInfo = JSON.parse(stockData[stock]);
          const meta = stockInfo?.chart?.result[0]?.meta || {};
          let regularMarketPrice = meta.regularMarketPrice || 0;
          let chartPreviousClose = meta.chartPreviousClose || 0;
          regularMarketPrice *= 83.4;
          chartPreviousClose *= 83.4;

          // Calculate the change percentage
          const regularMarketChangePercent =
            ((regularMarketPrice - chartPreviousClose) / chartPreviousClose) *
            100;

          return (
            <li key={index}>
              <span className="stock-name">{stockNames[stock]}</span>
              <span className="stock-price">
                ₹{regularMarketPrice.toFixed(2)}
              </span>
              <span
                className="arrow"
                style={{
                  color: regularMarketChangePercent > 0 ? "green" : "red",
                }}
              >
                {regularMarketChangePercent > 0 ? (
                  <span className="arrow-up">&#9650;</span>
                ) : (
                  <span className="arrow-down">&#9660;</span>
                )}
                ({regularMarketChangePercent.toFixed(2)}%)
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StockTicker;
