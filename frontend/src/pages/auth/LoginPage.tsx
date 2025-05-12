import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);

    // Parse the role from the URL query parameter, defaulting to "customer"
    const query = new URLSearchParams(location.search);
    const defaultRole = query.get("role") as "customer" | "restaurant" | "delivery" | null || "customer";
    const [role, setRole] = useState<"customer" | "restaurant" | "delivery">(defaultRole);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoginError(null);
        setIsLoading(true);

        if (!email || !password) {
            setError("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
                role,
            });

<<<<<<< Updated upstream
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
=======
            localStorage.setItem("foodFusionToken", response.data.token);
            localStorage.setItem("foodFusionUser", JSON.stringify(response.data.user));

            console.log("token:", response.data.token);
>>>>>>> Stashed changes

            navigate("/"); // Redirect to home or appropriate dashboard
        } catch (err: any) {
            if (err.response?.status === 403) {
                setLoginError(err.response.data.message); // Capture and display the specific message
            } else {
                setLoginError(err.response?.data?.message || "Login failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-md mx-auto py-16 px-4">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={role || "customer"} onValueChange={(value) => setRole(value as "customer" | "restaurant" | "delivery")}>
                        <TabsList className="grid grid-cols-3 mb-6">
                            <TabsTrigger value="customer">Customer</TabsTrigger>
                            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                            <TabsTrigger value="delivery">Delivery</TabsTrigger>
                        </TabsList>

                        <TabsContent value="customer">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {loginError && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                            {loginError}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="customer-email">Email</Label>
                                        <Input
                                            id="customer-email"
                                            type="email"
                                            placeholder="customer@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="customer-password">Password</Label>
                                            <Link
                                                to="/forgot-password"
                                                className="text-sm text-primary underline-offset-4 hover:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <Input
                                            id="customer-password"
                                            type="password"
                                            placeholder="********"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Signing in..." : "Sign in"}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                        <TabsContent value="restaurant">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {loginError && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                            {loginError}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="restaurant-email">Restaurant Email</Label>
                                        <Input
                                            id="restaurant-email"
                                            type="email"
                                            placeholder="restaurant@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="restaurant-password">Password</Label>
                                            <Link
                                                to="/forgot-password"
                                                className="text-sm text-primary underline-offset-4 hover:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <Input
                                            id="restaurant-password"
                                            type="password"
                                            placeholder="********"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Signing in..." : "Sign in as Restaurant"}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                        <TabsContent value="delivery">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {loginError && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                            {loginError}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="delivery-email">Delivery Email</Label>
                                        <Input
                                            id="delivery-email"
                                            type="email"
                                            placeholder="delivery@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="delivery-password">Password</Label>
                                            <Link
                                                to="/forgot-password"
                                                className="text-sm text-primary underline-offset-4 hover:underline"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <Input
                                            id="delivery-password"
                                            type="password"
                                            placeholder="********"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Signing in..." : "Sign in as Delivery"}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            to={`/register${role ? `?role=${role}` : ""}`}
                            className="text-primary underline-offset-4 hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;