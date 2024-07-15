/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import "../cssForComponents/Card.css";

const Card = ({ children }) => {
  return (
    <div className="cardborder w-full h-full rounded-md relative p-8">
      {children}
    </div>
  );
};

export default Card;
