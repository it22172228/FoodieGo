import React from 'react';

function DeliverPersonDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Active Deliveries</h2>
            <p className="text-gray-600">You have 5 active deliveries.</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Details
            </button>
          </div>
          {/* Card 2 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Earnings</h2>
            <p className="text-gray-600">This week: $450</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              View Earnings
            </button>
          </div>
          {/* Card 3 */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <p className="text-gray-600">Update your personal information.</p>
            <button className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
              Edit Profile
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4 mt-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 FoodieGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default DeliverPersonDashboard;