import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Layout/DeliverySidebar";
import { Bell } from "lucide-react";

// Define notification type
interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

function Notifications(): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fakeNotifications: Notification[] = [
      {
        id: 1,
        message: "You have been assigned a new delivery.",
        timestamp: "Just now",
      },
      {
        id: 2,
        message: "Order #12345 has been delivered successfully.",
        timestamp: "15 mins ago",
      },
      {
        id: 3,
        message: "Order #12346 is now out for delivery.",
        timestamp: "1 hour ago",
      },
    ];

    setTimeout(() => {
      setNotifications(fakeNotifications);
    }, 500);
  }, []);

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <div className="flex h-[85vh] bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-500" />
              Notifications
            </h2>

            {notifications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No new notifications.
              </p>
            ) : (
              <ul className="space-y-4">
                {notifications.map((note) => (
                  <li
                    key={note.id}
                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300"
                  >
                    <p className="text-gray-700 dark:text-gray-100">{note.message}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {note.timestamp}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
