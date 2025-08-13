import React, { useState, useEffect } from "react";
import { spins } from "./data";
import "./spinner.css";

const Spinner = ({ spinType, spinGift }) => {
  const [items, setItems] = useState([]);
  const [translateX, setTranslateX] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    // Spin type o'zgarsa listni qayta yasash
    const shuffledItems = createItems(spinType);
    setItems(shuffledItems);
    setTranslateX(0);
  }, [spinType]);

  useEffect(() => {
    if (spinGift && items.length > 0) {
      // SpinGift kelganda spin boshlash
      startSpin(spinGift);
    }
  }, [spinGift, items]);

  const createItems = (spinType) => {
    const arr = [];
    const spinData = spins[spinType] || [];
    spinData.forEach((gift) => {
      for (let i = 0; i < (gift.count || 1); i++) {
        arr.push(gift);
      }
    });
    const shuffled = arr.sort(() => Math.random() - 0.5);
    return Array(5).fill(shuffled).flat(); // 5 marta ko'paytirish
  };

  const startSpin = (selectedGift) => {
    if (isSpinning || items.length === 0) return;
    setIsSpinning(true);

    // Tanlangan sovg'aga mos indexlar
    const matchingPositions = items
      .map((item, index) =>
        item.name === selectedGift.name && item.price === selectedGift.price ? index : -1
      )
      .filter((index) => index !== -1);

    // O'rtadagi segmentdan random index tanlash
    const originalLength = items.length / 5;
    const middleStart = Math.floor(originalLength * 2);
    const middleEnd = Math.floor(originalLength * 3);
    const middleMatches = matchingPositions.filter(
      (index) => index >= middleStart && index < middleEnd
    );

    const randomIndex =
      middleMatches.length > 0
        ? middleMatches[Math.floor(Math.random() * middleMatches.length)]
        : matchingPositions[Math.floor(Math.random() * matchingPositions.length)] || 0;

    const itemWidth = 100; // gift-item kengligi
    const extraRounds = originalLength * itemWidth;
    const finalPosition = -(randomIndex * itemWidth + extraRounds);

    setTranslateX(finalPosition);

    // 2 soniyadan so'ng pozitsiyani qayta sozlash
    setTimeout(() => {
      setIsSpinning(false);
      const resetPosition = -(randomIndex % originalLength) * itemWidth;
      setTranslateX(resetPosition);
    }, 2000);
  };

  return (
    <div className="spinner-wrapper">
      <div
        className="spinner-track"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSpinning ? "transform 2s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
        }}
      >
        {items.length > 0 ? (
          items.map((gift, index) => (
            <div key={index} className="gift-item">
              <img src={gift.image} alt={gift.name} className="w-16 h-16" />
              <div className="gift-price">
                <span className="star">✨</span>
                <span>{gift.price}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-white">No items available</div>
        )}
      </div>
    
      <div className="selector-line" />
    </div>
  );
};

export default Spinner;
