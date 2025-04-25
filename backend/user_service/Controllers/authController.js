const User = require("../Models/User"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

// Handle user login
const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== role) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Your account is awaiting admin approval or has been suspended.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handle user registration
const register = async (req, res) => {
  const { name, email, password, role, location } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
      status: role === "restaurant" ? "pending" : "active",
      location: {
        location: location?.location, // e.g., "Malabe"
        city: location?.city,         // e.g., "Colombo"
      },
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully. Please wait for admin approval if applicable.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handle user logout
const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch user by ID (new addition)
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllDrivers = async (req, res) => {
  try {
    // Fetch all active drivers (users with role 'delivery' and status 'active')
    const drivers = await User.find({
      role: 'delivery',
      status: 'active',
    });

    // Check if drivers are found
    if (!drivers || drivers.length === 0) {
      return res.status(404).json({ error: 'No active drivers found' });
    }

    // Return list of active drivers
    return res.status(200).json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  login,
  register,
  logout,
  getUserProfile,
  getUserById, 
  getAllDrivers,
};
