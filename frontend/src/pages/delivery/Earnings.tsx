import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Layout/DeliverySidebar";
import { Wallet, DollarSign, Calendar, BarChart } from "lucide-react";

type Summary = {
  week: number;
  month: number;
  year: number;
};

type Record = {
  id: string;
  date: string;
  amount: number;
};

type SummaryCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

function Earnings() {
  const [summary, setSummary] = useState<Summary>({
    week: 5400,
    month: 22000,
    year: 255000,
  });

  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    const sample: Record[] = [
      { id: "#12345", date: "April 10, 2025", amount: 600 },
      { id: "#12346", date: "April 12, 2025", amount: 800 },
      { id: "#12347", date: "April 13, 2025", amount: 750 },
    ];
    setRecords(sample);
  }, []);

  return (
    <div className="dark:bg-background dark:text-foreground">
      <div className="flex min-h-[85vh] bg-gray-100 dark:bg-background">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto bg-white dark:bg-card dark:text-card-foreground p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-800 dark:text-foreground flex items-center gap-2">
                <Wallet className="text-green-600" size={30} />
                Earnings
              </h2>
              <button className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition">
                Download Report
              </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <SummaryCard
                title="This Week"
                value={summary.week}
                icon={<Calendar className="text-green-500" />}
              />
              <SummaryCard
                title="This Month"
                value={summary.month}
                icon={<BarChart className="text-green-500" />}
              />
              <SummaryCard
                title="This Year"
                value={summary.year}
                icon={<DollarSign className="text-green-500" />}
              />
            </div>

            {/* Table */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Recent Deliveries
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-muted border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-muted text-gray-600 dark:text-gray-300 uppercase text-sm">
                      <th className="py-3 px-6 text-left">Order ID</th>
                      <th className="py-3 px-6 text-left">Date</th>
                      <th className="py-3 px-6 text-left">Amount (LKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-muted/70 transition"
                      >
                        <td className="py-3 px-6">{record.id}</td>
                        <td className="py-3 px-6">{record.date}</td>
                        <td className="py-3 px-6 font-medium text-green-600 dark:text-green-400">
                          Rs. {record.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// SummaryCard Component
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => (
  <div className="bg-green-50 dark:bg-green-900 p-5 rounded-xl shadow-sm border border-green-100 dark:border-green-800 text-center">
    <div className="flex flex-col items-center gap-2">
      <div className="text-green-600 dark:text-green-400 mb-1">{icon}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h2 className="text-xl font-bold text-green-700 dark:text-green-300">
        Rs. {value.toLocaleString()}
      </h2>
    </div>
  </div>
);

export default Earnings;
