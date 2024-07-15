/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUser,
  faBars,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { XMarkIcon } from "@heroicons/react/24/solid";
import "../cssForComponents/Header.css";
import SearchResults from "./SearchResults";
import { searchSymbol } from "../api/stock-api";

const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

const Header = () => {
  const [input, setInput] = useState("");
  const [bestMatches, setBestMatches] = useState([]);

  const clear = () => {
    setInput("");
    setBestMatches([]);
  };

  const debouncedUpdateBestMatches = debounce(async () => {
    try {
      if (input.trim()) {
        const searchResults = await searchSymbol(input);
        setBestMatches(searchResults.result || []);
      } else {
        setBestMatches([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setBestMatches([]);
    }
  }, 300);

  useEffect(() => {
    debouncedUpdateBestMatches();
  }, [debouncedUpdateBestMatches, input]);

  // Below code is for Google login authentication
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Fetch the authentication status from the server
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:4000/auth/status", {
          method: "GET",
          credentials: "include", // Include credentials in the request
        });

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            // Set the user data if authenticated
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching authentication status:", error);
      }
    };

    fetchUser();
  }, []);

  // Handle Google login
  const handleLogin = () => {
    // Redirect the user to the Google OAuth authentication route in the Express server
    window.location.href = "http://localhost:4000/auth/google";
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/logout", {
        method: "GET",
        credentials: "include", // Include cookies and other credentials
      });

      if (response.ok) {
        // Logout successful
        setUser(null); // Clear the user data
        window.location.href = "http://localhost:5173"; // Redirect to frontend URL
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="header">
      <div className="container1 mx-auto flex justify-between items-center">
        <div className="logo-container flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="logo-icon" />
          <h1 className="logo">StoxyDom</h1>
        </div>
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search Stocks"
            className="search-bar"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          {input && (
            <button onClick={clear}>
              <XMarkIcon className="xicon h-4 w-4 fill-gray-500" />
            </button>
          )}
          {input && bestMatches.length > 0 && (
            <SearchResults results={bestMatches} />
          )}
        </div>
        <nav className="nav-links">
          <ul className="flex space-x-4">
            <li>
              <FontAwesomeIcon icon={faUser} className="nav-icon" />
              <a href="#" className="hover:text-gray-300">
                Portfolio
              </a>
            </li>
            <li>
              <FontAwesomeIcon icon={faChartLine} className="nav-icon" />
              <a href="#" className="hover:text-gray-300">
                Stocks
              </a>
            </li>
            <li>
              <FontAwesomeIcon icon={faNewspaper} className="nav-icon" />
              <a href="#" className="hover:text-gray-300">
                News
              </a>
            </li>
            <li>
              <FontAwesomeIcon icon={faBars} className="nav-icon" />
              <a href="#" className="hover:text-gray-300">
                More
              </a>
            </li>
          </ul>
          {/* Update the button based on user authentication status */}
          {user ? (
            <div className="logged flex items-center">
              <div className="profile flex items-center">
                <img
                  src={user.imageUrl}
                  alt="User Profile"
                  className="user-profile-image"
                  style={{ width: "33px", height: "33px", borderRadius: "50%" }}
                />
                <div className="logdetail">Hi, {user.displayName}</div>
              </div>

              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
