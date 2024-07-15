/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { startOfDay } from "date-fns";
import { DateAdapter } from "chartjs-adapter-date-fns";

// Configure Chart.js to use the date-fns adapter
Chart.register(DateAdapter);

const StockChart = () => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://sheetdb.io/api/v1/twh5yqg8ockqf");
        const data = await response.json();
        console.log(data);
        setStockData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!stockData || stockData.length === 0) return;

    const ctx = document.getElementById("stockChart");
    if (ctx) {
      const dates = stockData.map((item) => startOfDay(new Date(item.Date)));
      const openPrices = stockData.map((item) => parseFloat(item.Open));
      const highPrices = stockData.map((item) => parseFloat(item.High));
      const lowPrices = stockData.map((item) => parseFloat(item.Low));
      const closePrices = stockData.map((item) => parseFloat(item.Close));

      new Chart(ctx, {
        type: "candlestick",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Stock Price",
              data: stockData.map((item) => ({
                t: new Date(item.Date),
                o: parseFloat(item.Open),
                h: parseFloat(item.High),
                l: parseFloat(item.Low),
                c: parseFloat(item.Close),
              })),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Stock Price",
            },
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
                displayFormats: {
                  day: "MMM D",
                },
              },
            },
            y: {
              title: {
                display: true,
                text: "Price",
              },
            },
          },
        },
      });
    }
  }, [stockData]);

  return <canvas id="stockChart" width="800" height="400"></canvas>;
};

export default StockChart;
