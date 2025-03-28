import React from "react";

function Sample() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-600 mb-6">FoodieGo</h2>
        <nav>
          <ul className="space-y-4">
            <li className="text-yellow-600 font-semibold">Dashboard</li>
            <li className="text-gray-600">Deliveries</li>
            <li className="text-gray-600">Notifications</li>
            <li className="text-gray-600">Profile</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700">Delivery Dashboard</h1>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            Download Reports
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Total Deliveries</p>
            <h2 className="text-xl font-bold">+14%</h2>
            <p className="text-sm text-gray-400">Since last month</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Completed Today</p>
            <h2 className="text-xl font-bold">+21%</h2>
            <p className="text-sm text-gray-400">Since last month</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Monthly Deliveries</p>
            <h2 className="text-xl font-bold">+5%</h2>
            <p className="text-sm text-gray-400">Since last month</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500">Yearly Deliveries</p>
            <h2 className="text-xl font-bold">+43%</h2>
            <p className="text-sm text-gray-400">Since last month</p>
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Recent Deliveries</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">User ID</th>
                  <th className="py-3 px-6 text-left">Created At</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">#12345</td>
                  <td className="py-3 px-6">User123</td>
                  <td className="py-3 px-6">March 27, 2025</td>
                  <td className="py-3 px-6 text-green-600">Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Sample;
