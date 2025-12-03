// public/script.js
const restaurantListEl = document.getElementById("restaurant-list");
const searchInputEl = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");

let restaurants = [];
let activeFilter = "all";
let searchTerm = "";

// Fetch restaurants from backend
async function loadRestaurants() {
  try {
    const res = await fetch("/api/restaurants");
    restaurants = await res.json();
    renderRestaurants();
  } catch (err) {
    console.error(err);
    restaurantListEl.innerHTML = "<p>Failed to load restaurants.</p>";
  }
}

function showToast(msg, ms = 1200) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 300);
  }, ms);
}

// Render restaurant cards
function renderRestaurants() {
  restaurantListEl.innerHTML = "";

  const filtered = restaurants.filter(rest => {
    if (activeFilter !== "all" && rest.tag !== activeFilter) return false;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      const nameMatch = rest.name.toLowerCase().includes(term);
      const cuisinesMatch = rest.cuisines.join(" ").toLowerCase().includes(term);
      if (!nameMatch && !cuisinesMatch) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    restaurantListEl.innerHTML = "<p>No restaurants match your search.</p>";
    return;
  }

  filtered.forEach(rest => {
    const card = document.createElement("div");
    card.className = "restaurant-card";
    card.innerHTML = `
      <img src="${rest.image}" alt="${rest.name}" class="restaurant-img" />
      <div class="restaurant-content">
        <div class="restaurant-header">
          <div class="restaurant-name">${rest.name}</div>
          <div class="restaurant-rating">${rest.rating} ★</div>
        </div>
        <div class="restaurant-meta">${rest.cuisines.join(", ")}</div>
        <div class="restaurant-footer">
          <span>${rest.priceForTwo}</span>
          <span>${rest.deliveryTime}</span>
        </div>

        <div style="padding:10px;">
          <button class="place-order-btn" data-id="${rest.id}" style="width:100%; padding:10px; border-radius:8px; background:var(--primary); color:#fff; border:none; cursor:pointer;">
            Place Order
          </button>
        </div>
      </div>
    `;

    restaurantListEl.appendChild(card);

    const placeBtn = card.querySelector(".place-order-btn");
    if (!placeBtn) return;

    placeBtn.addEventListener("click", async () => {
      const orderPayload = {
        userId: null,
        restaurantId: rest.id,
        items: [{ name: `${rest.name} - Sample Item`, qty: 1, price: 100 }],
        total: 100
      };

      try {
        placeBtn.disabled = true;
        placeBtn.textContent = "Placing order...";

        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });

        // show raw server response for debugging if not ok
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { data = { raw: text }; }

        console.log("POST /api/orders status:", res.status, data);

        if (!res.ok) {
          placeBtn.disabled = false;
          placeBtn.textContent = "Place Order";
          alert("Server error: " + (data.message || JSON.stringify(data)));
          return;
        }

        showToast("Order placed!");
        // redirect to success page with id
        window.location.href = `/order-success.html?orderId=${data.orderId}`;
      } catch (err) {
        console.error("Network error:", err);
        alert("Network error: " + (err.message || err));
        placeBtn.disabled = false;
        placeBtn.textContent = "Place Order";
      }
    });
  });
}

// Handle search input
searchInputEl.addEventListener("input", e => {
  searchTerm = e.target.value;
  renderRestaurants();
});

// Handle filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.getAttribute("data-filter");
    renderRestaurants();
  });
});

// Initial load
loadRestaurants();
