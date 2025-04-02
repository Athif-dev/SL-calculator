import { useState } from "react";

export default function StopLossCalculator() {
  const [entryPrice, setEntryPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [maxLoss, setMaxLoss] = useState("");
  const [tradeType, setTradeType] = useState("buy"); // New state for Buy/Sell toggle
  const [stopLoss, setStopLoss] = useState(null);
  const [charges, setCharges] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const calculateCharges = () => {
    if (!entryPrice || !quantity || !maxLoss) return;

    const entry = parseFloat(entryPrice);
    const qty = parseFloat(quantity);
    const maxLossValue = parseFloat(maxLoss);

    // **Stop-Loss Calculation**
    const stopLossPrice =
      tradeType === "buy"
        ? entry - maxLossValue / qty
        : entry + maxLossValue / qty;

    // **Turnover Calculation**
    const turnover = entry * qty + stopLossPrice * qty;

    // **Brokerage (Lower of ₹20 or 0.03% of Turnover)**
    const brokerage = Math.min(20, (0.03 / 100) * turnover);

    // **STT (Only on Sell-Side for Intraday)**
    const stt =
      tradeType === "sell" ? (0.025 / 100) * (stopLossPrice * qty) : 0;

    // **Transaction Charges (NSE)**
    const txnCharges = (0.00325 / 100) * turnover;

    // **GST (18% on Brokerage + Transaction Charges)**
    const gst = (18 / 100) * (brokerage + txnCharges);

    // **Stamp Duty (Only on Buy-Side)**
    const stampDuty = tradeType === "buy" ? (0.003 / 100) * (entry * qty) : 0;

    // **SEBI Turnover Fees**
    const sebiCharges = (0.0001 / 100) * turnover;

    // **Total Charges**
    const totalCharges =
      brokerage + stt + txnCharges + gst + stampDuty + sebiCharges;

    setStopLoss(stopLossPrice.toFixed(2));
    setCharges({
      brokerage: brokerage.toFixed(2),
      stt: stt.toFixed(2),
      txnCharges: txnCharges.toFixed(2),
      gst: gst.toFixed(2),
      stampDuty: stampDuty.toFixed(2),
      sebiCharges: sebiCharges.toFixed(2),
      total: totalCharges.toFixed(2),
    });
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
        <div className="relative p-8 max-w-md w-full bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl border border-gray-700">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            SL Calculator
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              calculateCharges();
            }}
          >
            {/* Trade Type Toggle */}
            {/* Trade Type Toggle */}
            <div className="mb-4 flex items-center bg-gray-900 p-1 rounded-full">
              <button
                type="button"
                className={`w-1/2 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  tradeType === "buy"
                    ? "bg-green-500 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setTradeType("buy")}
              >
                Buy
              </button>
              <button
                type="button"
                className={`w-1/2 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  tradeType === "sell"
                    ? "bg-red-500 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setTradeType("sell")}
              >
                Sell
              </button>
            </div>

            {/* Entry Price */}
            <div className="mb-4">
              <label className="block text-gray-300 font-medium mb-1">
                Entry Price
              </label>
              <input
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-900 text-white rounded-lg"
              />
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-gray-300 font-medium mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-900 text-white rounded-lg"
              />
            </div>

            {/* Max Loss */}
            <div className="mb-4">
              <label className="block text-gray-300 font-medium mb-1">
                Max Loss (₹)
              </label>
              <input
                type="number"
                value={maxLoss}
                onChange={(e) => setMaxLoss(e.target.value)}
                className="w-full p-3 border border-gray-600 bg-gray-900 text-white rounded-lg"
              />
            </div>

            {/* Calculate Button */}
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all duration-300">
              Calculate
            </button>
          </form>
          {stopLoss && charges && (
            <div className="mt-6 p-4 bg-gray-900 text-center rounded-lg border border-gray-700">
              <p className="text-xl font-bold text-green-500">
                Stop-Loss Price: ₹{stopLoss}
              </p>
              <hr className="my-2 border-gray-700" />
              <p className="text-lg font-bold text-red-400">
                Total Charges: ₹{charges.total}
              </p>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-3 text-blue-400 underline"
              >
                {showDetails ? "Hide Details" : "View Details"}
              </button>
              {showDetails && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">
                    Brokerage: ₹{charges.brokerage}
                  </p>
                  <p className="text-gray-400">STT: ₹{charges.stt}</p>
                  <p className="text-gray-400">
                    Txn Charges: ₹{charges.txnCharges}
                  </p>
                  <p className="text-gray-400">GST: ₹{charges.gst}</p>
                  <p className="text-gray-400">
                    Stamp Duty: ₹{charges.stampDuty}
                  </p>
                  <p className="text-gray-400">
                    SEBI Fees: ₹{charges.sebiCharges}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <p className="bg-blue-500 text-white">
        Designed & Developed by{" "}
        <a
          href="https://github.com/Athif-dev"
          target="blank"
          className="cursor-pointer font-semibold"
        >
          Athif
        </a>
      </p>
    </>
  );
}
