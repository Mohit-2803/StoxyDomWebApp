from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS to allow cross-origin requests from the client
CORS(app, origins=["http://localhost:5173"])  # Adjust origin if necessary

# Dictionary to hold stock symbols and corresponding stock names
stock_data = {
    "nifty-50-index-.NSEI": "Nifty 50",
    "nifty-midcap-100-index-.NIFMDCP100": "Nifty 100 Midcap",
    "nifty-100-index-.NIFTY100": "Nifty 100 Largecap",
    "nifty-bank-index-.NSEBANK": "Nifty Bank",
    "nifty-it-index-.NIFTYIT": "Nifty IT",
    "niftysm100-.NIFSMCP100": "Nifty 100 Smallcap",
    "nifty-pharma-index-.NIPHARM": "Nifty Pharma",
}


# Function to fetch stock data from a URL and extract price, bracketed change, and calculate percentage change
def fetch_stock_data(stock_symbol):
    url = f"https://www.tickertape.in/stocks/{stock_symbol}"
    response = requests.get(url)

    # Check if the response status code is 200 (OK)
    if response.status_code != 200:
        return None, None, None

    # Parse the page using BeautifulSoup
    soup = BeautifulSoup(response.text, "html.parser")

    # Extract the price
    price_element = soup.select_one(".current-price.jsx-1156941347")
    price = price_element.text if price_element else None

    # Initialize bracketed_value and percentage_change to None
    bracketed_value = None
    percentage_change = None

    # Locate change data using the provided CSS selector
    change_elements = soup.select(
        ".quote-box-root.jsx-1156941347 .change.jsx-1156941347"
    )

    # Check if any change data is found
    if change_elements:
        # Combine all the change data text (if multiple elements are found)
        change_text = " ".join([element.text for element in change_elements])

        # Find the first occurrence of '(' and ')'
        start_index = change_text.find("(")
        end_index = change_text.find(")")

        # Extract the value inside the brackets
        if start_index != -1 and end_index != -1:
            bracketed_value = change_text[start_index + 1 : end_index]

            # Convert the bracketed value to float
            bracketed_value = float(bracketed_value)

    # Convert the price from string to float and remove any commas
    if price:
        price = float(price.replace(",", ""))

    # Calculate percentage change if both price and bracketed value are available
    if price is not None and bracketed_value is not None:
        percentage_change = (bracketed_value / price) * 100

    # Return the price, the extracted bracketed value, and percentage change
    return price, bracketed_value, percentage_change


# Define a route to fetch market and sector data
@app.route("/market-and-sectors", methods=["GET"])
def get_market_and_sectors_data():
    market_sectors_data = {}

    # Fetch data for each stock symbol
    for symbol, name in stock_data.items():
        price, bracketed_value, percentage_change = fetch_stock_data(symbol)
        market_sectors_data[name] = {
            "symbol": symbol,
            "price": price,
            "change_bracketed_value": bracketed_value,
            "percentage_change": percentage_change,
        }

    # Return the market and sector data as a JSON response
    return jsonify(market_sectors_data)


# Run the server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
