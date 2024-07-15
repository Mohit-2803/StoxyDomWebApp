// const express = require("express");
// const axios = require("axios");

// const router = express.Router();

// const getGoldRate = async () => {
//   try {
//     const response = await axios.get("https://www.goldapi.io/api/XAU/INR", {
//       headers: {
//         "x-access-token": "goldapi-2t8nkslvov9hom-io",
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching gold rate:", error);
//     throw error;
//   }
// };

// router.get("/gold-rate", async (req, res) => {
//   try {
//     const goldData = await getGoldRate();
//     res.json(goldData);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching gold rate" });
//   }
// });

// // New route to handle today's market data
// router.get("/todaysmarket", async (req, res) => {
//   try {
//     // Fetch today's market data from the API
//     const response = await axios.get(
//       "https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=H3E0QUT0UESB05MO"
//     );

//     // Return the API data as a JSON response
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching today's market data:", error);
//     res.status(500).json({ message: "Error fetching today's market data" });
//   }
// });

// module.exports = router;
