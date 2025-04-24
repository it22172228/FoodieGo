import React, { useState } from "react";
import Sidebar from "../../components/Layout/DeliverySidebar";
// import Footer from "../../components/delivery/Footer";
import { MapPin, ClipboardList } from "lucide-react";

function DeliveryDetails() {
  const [status, setStatus] = useState("Pending");

  const delivery = {
    restaurant: "Pizza Palace",
    pickup: "123 Main St, City",
    customer: "456 Elm St, City",
    items: ["2 Large Pizzas", "1 Soda"],
  };

  const handleAccept = async () => {
    try {
      setStatus("Accepted");

      const response = await fetch("http://localhost:5200/api/delivery/assignDriver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          orderId: "ORDER_ID_HERE",
          restaurantId: "RESTAURANT_ID_HERE",
          dropLatitude: 7.2906,
          dropLongitude: 80.6337,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      console.log("Delivery assigned:", result.delivery);
    } catch (err) {
      console.error("Failed to assign delivery:", err.message);
    }
  };

  const handleReject = () => {
    setStatus("Rejected");
    // Trigger backend rejection here
  };

  return (
    <div>
      <div className="flex min-h-[85vh] bg-gray-100 dark:bg-gray-900 transition-colors">
        <Sidebar />

        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-100 flex items-center gap-2">
                <ClipboardList className="text-blue-500 dark:text-blue-400" />
                Delivery Details
              </h2>
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${
                  status === "Accepted"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : status === "Rejected"
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                }`}
              >
                {status}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                <strong>Restaurant:</strong> {delivery.restaurant}
              </p>

              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                <strong>Pickup Address:</strong> {delivery.pickup}
              </p>

              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                <strong>Customer Address:</strong> {delivery.customer}
              </p>

              <p className="text-gray-600 dark:text-gray-300">
                <strong>Items:</strong>{" "}
                {delivery.items.map((item, i) => (
                  <span key={i}>
                    {item}
                    {i < delivery.items.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>

            {/* Delivery Progress Bar */}
            {status === "Accepted" && (
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 mb-2">Delivery Progress</p>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-yellow-500 text-white">
                      Delivery Accepted
                    </span>
                  </div>
                  <div className="flex mb-2">
                    <div className="w-1/2 text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-yellow-300 text-white">
                      En Route
                    </div>
                    <div className="w-1/2 text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-gray-300 dark:bg-gray-600 text-white">
                      Delivered
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {status === "Pending" ? (
              <div className="flex space-x-4">
                <button
                  onClick={handleAccept}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Accept Delivery
                </button>
                <button
                  onClick={handleReject}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Reject Delivery
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                You have {status === "Accepted" ? "accepted" : "rejected"} this
                delivery.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default DeliveryDetails;
