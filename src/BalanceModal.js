import React, { useState } from "react";
import axios from "axios";

const BalanceModal = ({ show, setShow, userId, setCurrentStars }) => {
  const [amount, setAmount] = useState("");

  const buyStars = async () => {
    if (!userId) {
      alert("❌ Telegram foydalanuvchi aniqlanmadi.");
      return;
    }
    if (!amount || amount < 10) {
      alert("❗ Iltimos, minimal 10 yulduz kiriting.");
      return;
    }

    try {
      const res = await axios.post("https://your-api-domain/invoice.php", { chat_id: userId, amount });
      if (res.data.ok) {
        window.Telegram.WebApp.openInvoice(res.data.result);
        setShow(false);
        setAmount("");
      } else {
        alert("❌ Xatolik: " + (res.data.description || "Invoice ochilmadi"));
      }
    } catch (err) {
      alert("❌ Server bilan bog‘lanishda xatolik");
      console.error(err);
    }
  };

  return (
    <div className={`modal fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] ${show ? "block" : "hidden"} backdrop-blur-sm`}>
      <div className="modal-content bg-white p-8 rounded-2xl w-11/12 max-w-md text-center shadow-2xl relative">
        <span className="close-btn absolute top-4 right-4 text-2xl font-bold text-gray-600 cursor-pointer hover:text-black transition-colors" onClick={() => setShow(false)}>
          &times;
        </span>
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Yangi miqdor kiriting</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Masalan: 100"
          className="w-full p-3 mb-5 border border-gray-300 rounded-lg text-base focus:border-green-500 focus:outline-none transition-colors"
        />
        <button
          onClick={buyStars}
          className="w-full p-3 bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-500 transition-transform hover:-translate-y-1"
        >
          Davom etish
        </button>
      </div>
    </div>
  );
};

export default BalanceModal;