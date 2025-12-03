# QuickBite 🍕🍽️
Simple Food Ordering Website built with **Node.js**, **Express**, and plain **HTML/CSS/JS**.

## 📌 Overview

QuickBite is a mini Zomato-style food ordering project.  
It shows a list of restaurants, lets users “place” a sample order, and displays an **Order Successful** screen.  
It’s perfect as a full-stack starter project for learning:

- Basic **Express.js API** (GET + POST)
- Serving static frontend files
- Working with simple **JSON files** as storage

---

## ✨ Features

- 🏠 **Landing page** with:
  - Hero banner
  - Search bar (filter by restaurant name or cuisine)
  - Filter buttons (Delivery / Dining Out / Cafes)
- 🍽️ **Restaurant listing**:
  - Cards with image, cuisines, rating, price for two, delivery time
  - “Place Order” button on each card
- ✅ **Order placement flow**:
  - Sends POST request to `/api/orders`
  - Stores order in `data/orders.json`
  - Redirects to `order-success.html` with Order ID shown
- 👤 **Auth pages (UI only)**:
  - `login.html` and `signup.html` with modern UI
  - Ready to be connected to real `/api/login` and `/api/signup` endpoints
- 🖥️ **Simple dashboard page** after login (`dashboard.html`)
- 🔔 **Toast notification** for “Order placed!” feedback

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, Vanilla JS
- **Storage:** JSON files (`restaurants.json`, `users.json`, `orders.json`)

---

## 📂 Project Structure

```bash
project-root/
├── server.js
├── package.json
├── data/
│   ├── restaurants.json   # Restaurant list (sample data)
│   ├── users.json         # Empty array (auth storage placeholder)
│   └── orders.json        # Orders stored here
└── public/
    ├── index.html         # Home page (restaurant listing)
    ├── login.html         # Login page (UI)
    ├── signup.html        # Signup page (UI)
    ├── dashboard.html     # Simple “logged-in” dashboard page
    ├── order-success.html # Order success page
    ├── style.css          # All styles (layout, auth, toast, etc.)
    └── script.js          # Frontend logic (restaurants, filters, order flow)


## 👩‍💻 **Authors**

**This project was created by:**

- **Purvi Srinivas**  
- **Pallavi U**  
- **Priyanka K S**  
- **Prajna P Naik**
