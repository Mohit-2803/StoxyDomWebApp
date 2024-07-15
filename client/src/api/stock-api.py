from flask import Flask, jsonify
import yfinance as yf

app = Flask(__name__)


@app.route("/api/stock_data")
def get_stock_data():
    stock_data = yf.download(
        "AAPL", start="2022-01-01", end="2022-12-31", progress=False
    )
    # Process the stock data as needed
    dates = stock_data.index.tolist()
    closing_prices = stock_data["Close"].tolist()
    processed_data = {"dates": dates, "closing_prices": closing_prices}
    return jsonify(processed_data)


if __name__ == "__main__":
    app.run(debug=True)
