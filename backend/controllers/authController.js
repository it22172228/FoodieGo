const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Function to generate unique username
const generateUsername = async (role) => {
  let prefix = "";
  if (role === "Admin") prefix = "admin";
  else if (role === "RestaurantManager") prefix = "rest";
  else if (role === "User") prefix = "user";
  else throw new Error("Invalid role");

  // Find the latest user with the same role
  const latestUser = await User.findOne({ role }).sort({ createdAt: -1 });

  let newId = "001"; // Default ID for the first user
  if (latestUser && latestUser.username) {
      let lastId = latestUser.username.replace(prefix, ""); // Extract numeric part
      newId = String(parseInt(lastId) + 1).padStart(3, "0"); // Increment & format
  }

  return `${prefix}${newId}`;
};


// Register Function
exports.register = async (req, res) => {
  try {
      const { email, password, role } = req.body;

      // Check if all required fields are provided
      if (!email || !password || !role) {
          return res.status(400).json({ message: "All fields are required" });
      }

      // Generate username properly
      const username = await generateUsername(role);  // Ensure this is awaited

      console.log("Generated Username:", username);  // Debugging: Check if username is generated

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
          username: username,  // Ensure username is correctly assigned
          email: email,
          password: hashedPassword,
          role: role
      });

      await newUser.save();

      res.status(201).json({
          message: 'User registered successfully',
          username: username,
          role: role
      });

  } catch (err) {
      console.error("Error in Register:", err);  // Debugging
      res.status(500).json({ error: err.message });
  }
};



exports.login = async (req, res) => {
  try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: 'User not found' });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Role-based navigation logic
      let redirectPath = "";
      if (user.role === "Admin") redirectPath = "/admin/dashboard";
      else if (user.role === "RestaurantManager") redirectPath = "/restaurant/dashboard";
      else if (user.role === "User") redirectPath = "/user/dashboard";

      res.json({ token, role: user.role, redirectPath });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};
