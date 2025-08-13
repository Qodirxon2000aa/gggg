import React from "react";
import { spins } from "./data";
import "./ProbabilityList.css"; // Assuming you have a CSS file for styles

const ProbabilityList = ({ spinType }) => {
  return (
    <div className="probability-section mt-5">
      <h2 className="text-xl font-semibold text-white mb-3">Yutuqlar ehtimolligi</h2>
      <ul className="probability-list flex gap-4 justify-start items-stretch p-0 m-0">
        {spins[spinType].map((gift, index) => {
          const probability = ((gift.count / 50) * 100).toFixed(2);
          return (
            <li
              key={index}
              className="flex-1 min-w-[120px] bg-gray-700 rounded-xl shadow-md p-4 flex flex-col items-center justify-start hover:-translate-y-1 hover:scale-105 transition-transform"
            >
              <span className="probability-badge absolute top-2 left-2 bg-gray-800 text-white rounded-lg px-2 py-1 text-sm font-semibold shadow-sm">
                {probability}%
              </span>
              <img src={gift.image} alt={gift.name} className="w-10 h-10 mt-8 mb-2 rounded-full shadow-sm" />
              <span className="prize-name text-white font-medium text-base">{gift.name}</span>
              <span className="prize-price text-yellow-400 bg-gray-800 rounded-lg px-2 py-1 text-sm font-semibold mt-2 flex items-center gap-1">
                ✨ {gift.price}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProbabilityList;