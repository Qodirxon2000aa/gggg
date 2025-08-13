import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import ProbabilityList from "./ProbabilityList";
import BalanceModal from "./BalanceModal";
import { spins } from "./data";
import "./modal.css";

const App = () => {
  const [currentStars, setCurrentStars] = useState(0);
  const [userId, setUserId] = useState(null);
  const [result, setResult] = useState("");
  const [spinType, setSpinType] = useState(25);
  const [showModal, setShowModal] = useState(false);
  const [showModalResult, setShowModalResult] = useState(false);
  const [spinGift, setSpinGift] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(true); // Track demo mode state

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    if (tg.initDataUnsafe?.user?.id) {
      setUserId(tg.initDataUnsafe.user.id);
      fetchBalance(tg.initDataUnsafe.user.id);
    } else {
      setResult("❌ Telegram foydalanuvchisi aniqlanmadi.");
    }
  }, []);

  const fetchBalance = async (userId) => {
    try {
      const res = await axios.get(`https://your-api-domain/get_balance.php?user_id=${userId}`);
      if (res.data.balance !== undefined) {
        setCurrentStars(res.data.balance);
      } else {
        setResult("❌ Balans mavjud emas");
      }
    } catch (error) {
      setResult("❌ Xatolik yuz berdi");
      console.error(error);
    }
  };

  const handleSpin = async (isDemo, cost) => {
    if (!isDemo && currentStars < cost) {
      setResult("❌ Balansingizda yetarli yulduz yo‘q!");
      return;
    }

    setResult("");
    if (!isDemo) {
      try {
        const res = await axios.post("https://your-api-domain/update_balance.php", {
          user_id: userId,
          cost,
        });
        if (res.data.success) {
          setCurrentStars(res.data.main_balance);
          spin(cost, isDemo);
        } else {
          setResult("❌ Balansni yangilashda xatolik!");
        }
      } catch {
        setResult("❌ Server bilan ulanishda xatolik!");
      }
    } else {
      spin(cost, isDemo);
    }
  };

  const spin = (spinType, isDemo) => {
    const selectedGift = selectGiftByProbability(spinType);
    setSpinGift(selectedGift);

    setTimeout(() => {
      setShowModalResult(true); // Show the modal with the result
      if (!isDemo) {
        setCurrentStars((prev) => prev + selectedGift.price);
        axios.post("https://your-api-domain/add_balance.php", {
          user_id: userId,
          cost: selectedGift.price,
        });
      }
    }, 2000);
  };

  const closeModalResult = () => {
    setShowModalResult(false);
  };

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
    setShowModalResult(false); // Close modal after toggling
  };

  const selectGiftByProbability = (spinType) => {
    const totalSlots = 50;
    const rand = Math.floor(Math.random() * totalSlots);
    let currentSlot = 0;
    for (const gift of spins[spinType] || []) {
      currentSlot += gift.count;
      if (rand < currentSlot) {
        return gift;
      }
    }
    return spins[spinType]?.[0] || { name: "Default", price: 0, image: "" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex justify-center items-center p-4 relative">
      <div className="container">
  <div
    className="balance-btn"
    onClick={() => setShowModal(true)}
  >
    💰 <span>{currentStars}</span> ✨
  </div>
</div>
      
      <div className="container max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-5 text-white drop-shadow-md">🎁 Sovg‘a Spinner</h1>
        <Spinner spinType={spinType} selectGiftByProbability={selectGiftByProbability} spinGift={spinGift} />
        <br />
        <div className="buttons flex flex-wrap gap-3 justify-center">
     
          <select
            value={spinType}
            onChange={(e) => setSpinType(parseInt(e.target.value))}
            className="p-3 bg-gradient-to-r from-pink-500 to-pink-300 text-white rounded-lg"
          >
            <option value="25">Demo: 25 ✨</option>
            <option value="50">Demo: 50 ✨</option>
          </select>
          <button
            onClick={() => handleSpin(true, spinType)}
            className="p-3 bg-gradient-to-r from-pink-500 to-pink-300 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-pink-400 transition-transform hover:-translate-y-1"
          >
            Demo rejim
          </button>
          <button
            onClick={() => handleSpin(false, 25)}
            className="p-3 bg-gradient-to-r from-pink-500 to-pink-300 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-pink-400 transition-transform hover:-translate-y-1"
          >
            25 ✨ bilan aylantir
          </button>
          <button
            onClick={() => handleSpin(false, 50)}
            className="p-3 bg-gradient-to-r from-pink-500 to-pink-300 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-pink-400 transition-transform hover:-translate-y-1"
          >
            50 ✨ bilan aylantir
          </button>
        </div>
        <div className="result mt-5 text-yellow-400 font-medium text-lg min-h-[50px]" dangerouslySetInnerHTML={{ __html: result }} />
        <ProbabilityList spinType={spinType} />
      </div>
      <BalanceModal show={showModal} setShow={setShowModal} userId={userId} setCurrentStars={setCurrentStars} />
      {showModalResult && (
        <div className="modal-overlay" onClick={closeModalResult}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={spinGift?.image} alt="Gift" className="modal-gift" />
            <h2 className="modal-title">🎉 Tabriklaymiz!</h2>
            <p className="modal-description">Demo rejm.</p>
            <p className="modal-gift-details">Gift: {spinGift?.name || "Unknown"}!<br />✨ {spinGift?.price || 0} yulduz</p>
            <button className="modal-button" onClick={toggleDemoMode}>
              Demo rejimni o'chirish
            </button>
            <button className="modal-button" onClick={closeModalResult}>
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;