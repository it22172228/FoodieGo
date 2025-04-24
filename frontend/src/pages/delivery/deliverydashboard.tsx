import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Layout/DeliverySidebar";

interface Stats {
  total: number;
  today: number;
  monthly: number;
  yearly: number;
}

interface Delivery {
  id: string;
  userId: string;
  createdAt: string;
  status: string;
}

const DeliveryDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total: 128,
    today: 8,
    monthly: 65,
    yearly: 380,
  });

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const sampleDeliveries: Delivery[] = [
      { id: "#12345", userId: "User123", createdAt: "March 27, 2025", status: "Completed" },
      { id: "#12346", userId: "User456", createdAt: "March 28, 2025", status: "In Transit" },
      { id: "#12347", userId: "User789", createdAt: "March 29, 2025", status: "Pending" },
    ];
    setDeliveries(sampleDeliveries);
  }, []);

  return (
    <div className="flex h-[85vh] bg-softWhite dark:bg-gray-900 text-deepCharcoal dark:text-white">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
          <button className="flex items-center px-4 py-2 bg-deepBlue text-white rounded-lg shadow hover:bg-deepBlue-dark dark:bg-blue-700 dark:hover:bg-blue-800">
            Download Reports
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Deliveries" value={stats.total} />
          <StatCard title="Completed Today" value={stats.today} />
          <StatCard title="Monthly Deliveries" value={stats.monthly} />
          <StatCard title="Yearly Deliveries" value={stats.yearly} />
        </div>

        {/* Recent Deliveries Table */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4">Recent Deliveries</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead>
                <tr className="bg-coolGray dark:bg-gray-700 text-deepCharcoal dark:text-white uppercase text-sm">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">User ID</th>
                  <th className="py-3 px-6 text-left">Created At</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery, index) => (
                  <tr key={index} className="border-b border-coolGray dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="py-3 px-6">{delivery.id}</td>
                    <td className="py-3 px-6">{delivery.userId}</td>
                    <td className="py-3 px-6">{delivery.createdAt}</td>
                    <td className={`py-3 px-6 ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
    <p className="text-gray-500 dark:text-gray-300">{title}</p>
    <h2 className="text-xl font-bold text-deepCharcoal dark:text-white">{value}</h2>
    <p className="text-sm text-gray-400 dark:text-gray-400">Since last month</p>
  </div>
);

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Completed":
      return "text-limeGreen";
    case "In Transit":
      return "text-blue-600 dark:text-blue-400";
    case "Pending":
      return "text-yellow-500";
    default:
      return "text-deepCharcoal dark:text-white";
  }
};

export default DeliveryDashboard;
