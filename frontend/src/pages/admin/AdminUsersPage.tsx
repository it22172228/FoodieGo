
import React, { useState } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Filter, MoreVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAdmin } from "@/contexts/AdminContext";
import { useNotification } from "@/contexts/NotificationContext";

// Mock data
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "customer", status: "active", created: "2023-10-15" },
  { id: "2", name: "Sarah Smith", email: "sarah@example.com", role: "customer", status: "active", created: "2023-11-02" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "customer", status: "suspended", created: "2023-09-28" },
];

const mockRestaurants = [
  { id: "1", name: "Thai Orchid", owner: "Lisa Thai", registered: "2023-10-01", status: "active", orders: 145 },
  { id: "2", name: "Pizza Palace", owner: "Mario Rossi", registered: "2023-11-10", status: "pending", orders: 0 },
  { id: "3", name: "Burger Joint", owner: "Bob Burger", registered: "2023-09-15", status: "active", orders: 234 },
  { id: "4", name: "Sushi Express", owner: "Hiro Tanaka", registered: "2023-11-05", status: "pending", orders: 0 },
];

const mockDrivers = [
  { id: "1", name: "David Driver", email: "david@example.com", joined: "2023-08-15", status: "active", deliveries: 89 },
  { id: "2", name: "Emma Smith", email: "emma@example.com", joined: "2023-09-20", status: "active", deliveries: 64 },
  { id: "3", name: "Jack Wilson", email: "jack@example.com", joined: "2023-10-05", status: "inactive", deliveries: 32 },
];

const AdminUsersPage = () => {
  const { suspendAccount, activateAccount } = useAdmin();
  const { showNotification } = useNotification();
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleStatusChange = (id: string, type: "restaurant" | "user" | "driver", currentStatus: string) => {
    if (currentStatus === "active" || currentStatus === "pending") {
      suspendAccount(id, type);
      showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} account suspended`, "warning");
    } else {
      activateAccount(id, type);
      showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} account activated`, "success");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Users & Account Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border rounded-md w-64"
          />
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Customers ({mockUsers.length})</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants ({mockRestaurants.length})</TabsTrigger>
          <TabsTrigger value="drivers">Delivery Personnel ({mockDrivers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Customer Accounts</CardTitle>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.created}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusChange(user.id, "user", user.status)}
                          >
                            {user.status === "active" ? "Suspend" : "Activate"}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-sm font-medium">Name</h3>
                                    <p>{selectedUser.name}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Email</h3>
                                    <p>{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Joined</h3>
                                    <p>{selectedUser.created}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium">Account Status</h3>
                                    <p>{selectedUser.status}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurants">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Restaurant Accounts</CardTitle>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRestaurants.map(restaurant => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">{restaurant.name}</TableCell>
                      <TableCell>{restaurant.owner}</TableCell>
                      <TableCell>{restaurant.registered}</TableCell>
                      <TableCell>{restaurant.orders}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          restaurant.status === "active" ? "bg-green-100 text-green-700" : 
                          restaurant.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {restaurant.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusChange(restaurant.id, "restaurant", restaurant.status)}
                          >
                            {restaurant.status === "active" ? "Suspend" : "Activate"}
                          </Button>
                          <Button variant="outline" size="sm">Details</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Delivery Personnel</CardTitle>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDrivers.map(driver => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">{driver.name}</TableCell>
                      <TableCell>{driver.email}</TableCell>
                      <TableCell>{driver.joined}</TableCell>
                      <TableCell>{driver.deliveries}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          driver.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {driver.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusChange(driver.id, "driver", driver.status)}
                          >
                            {driver.status === "active" ? "Suspend" : "Activate"}
                          </Button>
                          <Button variant="outline" size="sm">Details</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminUsersPage;
