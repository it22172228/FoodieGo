const User = require("../Models/User"); // Adjust path as needed
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

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

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

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
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully. Please wait for admin approval if applicable.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = (req, res) => {
  // If you're using cookies to store JWT, use clearCookie
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

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

module.exports = {
  login,
  register,
  logout,
  getUserProfile,
};
