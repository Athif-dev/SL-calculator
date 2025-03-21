import { useState } from "react";

export default function StopLossCalculator() {
  const [entryPrice, setEntryPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [maxLoss, setMaxLoss] = useState("");
  const [stopLoss, setStopLoss] = useState(null);
  const [charges, setCharges] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const calculateCharges = () => {
    if (!entryPrice || !quantity || !maxLoss) return;

    const entry = parseFloat(entryPrice);
    const qty = parseFloat(quantity);
    const maxLossValue = parseFloat(maxLoss);

    // **Stop-Loss Calculation**
    const stopLossPrice = entry - maxLossValue / qty;

    // **Turnover Calculation**
    const turnover = entry * qty + stopLossPrice * qty;

    // **Brokerage (Lower of ₹20 or 0.03% of Turnover)**
    const brokerage = Math.min(20, (0.03 / 100) * turnover);

    // **STT (Only on Sell-Side)**
    const stt = (0.025 / 100) * (stopLossPrice * qty);

    // **Transaction Charges (NSE)**
    const txnCharges = (0.00325 / 100) * turnover;

    // **GST (18% on Brokerage + Transaction Charges)**
    const gst = (18 / 100) * (brokerage + txnCharges);

    // **Stamp Duty (Only on Buy-Side)**
    const stampDuty = (0.003 / 100) * (entry * qty);

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
          <button
            onClick={calculateCharges}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          >
            Calculate
          </button>

          {stopLoss && charges && (
            <div className="mt-6 p-4 bg-gray-900 text-center rounded-lg border border-gray-700">
              {/* Stop-Loss Price */}
              <p className="text-xl font-bold text-green-500">
                Stop-Loss Price: ₹{stopLoss}
              </p>

              <hr className="my-2 border-gray-700" />

              {/* Total Charges */}
              <p className="text-lg font-bold text-red-400">
                Total Charges: ₹{charges.total}
              </p>

              {/* Toggle Button */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-3 text-blue-400 underline focus:outline-none"
              >
                {showDetails ? "Hide Details" : "View Details"}
              </button>

              {/* Dropdown Details */}
              {showDetails && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg transition-all duration-300">
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
