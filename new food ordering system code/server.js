// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Paths
const dataDir = path.join(__dirname, "data");
const restaurantsFile = path.join(dataDir, "restaurants.json");
const usersFile = path.join(dataDir, "users.json");
const ordersFile = path.join(dataDir, "orders.json");

// Default restaurants (small sample)
const defaultRestaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    image:
      "https://images.pexels.com/photos/4109084/pexels-photo-4109084.jpeg?auto=compress&cs=tinysrgb&w=800",
    cuisines: ["Pizza", "Italian", "Fast Food"],
    priceForTwo: "₹400 for two",
    rating: 4.3,
    deliveryTime: "30 min",
    tag: "delivery",
    location: "Downtown"
  },
  {
    id: 2,
    name: "Burger Hub",
    image:
      "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800",
    cuisines: ["Burgers", "Fast Food", "Beverages"],
    priceForTwo: "₹300 for two",
    rating: 4.0,
    deliveryTime: "28 min",
    tag: "delivery",
    location: "City Center"
  }
];

// Ensure data folder and files exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
if (!fs.existsSync(restaurantsFile)) {
  fs.writeFileSync(restaurantsFile, JSON.stringify(defaultRestaurants, null, 2));
}
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
}
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
}

// Helpers
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ROUTES

// Get all restaurants
app.get("/api/restaurants", (req, res) => {
  try {
    const restaurants = readJson(restaurantsFile);
    res.json(restaurants);
  } catch (err) {
    console.error("Error reading restaurants:", err);
    res.status(500).json({ message: "Unable to read restaurants data" });
  }
});

// Get one restaurant by ID
app.get("/api/restaurants/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const restaurants = readJson(restaurantsFile);
    const restaurant = restaurants.find(r => r.id === id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (err) {
    console.error("Error reading single restaurant:", err);
    res.status(500).json({ message: "Unable to read restaurant data" });
  }
});

// Create order
app.post("/api/orders", (req, res) => {
  try {
    const { userId, items, total, restaurantId } = req.body;

    // quick validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.warn("Bad order payload:", req.body);
      return res.status(400).json({ message: "Order items required." });
    }

    // read & append
    const orders = readJson(ordersFile);

    const newOrder = {
      id: Date.now(),
      userId: userId || null,
      restaurantId: restaurantId || null,
      items,
      total: total || 0,
      status: "placed",
      placedAt: new Date().toISOString()
    };

    orders.push(newOrder);
    writeJson(ordersFile, orders);

    console.log("New order created:", newOrder.id);
    res.status(201).json({ message: "Order placed", orderId: newOrder.id });
  } catch (err) {
    console.error("ERROR in /api/orders:", err);
    res.status(500).json({ message: "Failed to place order." });
  }
});

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
