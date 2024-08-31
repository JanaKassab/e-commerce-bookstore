document.addEventListener("DOMContentLoaded", () => {
  // Load navigation
  fetch("Navigation.html")
    .then((response) => response.text())
    .then((data) => {
      const navPlaceholder = document.getElementById("Nav-placeholder");
      if (navPlaceholder) {
        navPlaceholder.innerHTML = data;
      }
    })
    .catch((error) => console.error("Error loading navigation:", error));

  // Load books data from local storage
  loadBooksData();
  // Render orders on page load
  renderOrders();
});

const modal = document.getElementById("order-modal");
const closeModalButton = document.querySelector(".close");
const form = document.getElementById("order-form");
let isUpdating = false;
let updatingIndex = null;
let booksData = []; // Array to store books data

document.getElementById("add-order").addEventListener("click", () => {
  modal.style.display = "block";
  document.getElementById("modal-title").innerText = "Add Order";
  form.reset();
  document.getElementById("books-section").innerHTML = createBookEntry();

  const orders = getOrders();
  const nextOrderId = orders.length > 0 ? orders[orders.length - 1].id + 1 : 1;
  document.getElementById("order-id").value = nextOrderId;

  isUpdating = false;
});

closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

document.getElementById("add-book").addEventListener("click", () => {
  const booksSection = document.getElementById("books-section");
  booksSection.insertAdjacentHTML("beforeend", createBookEntry());
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const orders = getOrders();

  const books = Array.from(document.querySelectorAll(".book-entry"))
    .map((entry) => {
      const name = entry.querySelector(".book-name").value;
      const qty = Number(entry.querySelector(".book-qty").value);
      const price = Number(entry.querySelector(".book-price").value);

      // Check if the book exists in the loaded book data
      const bookData = booksData.find((book) => book.title === name);

      if (!bookData) {
        alert(`Book with title "${name}" does not exist.`);
        return null; // Skip adding this book
      }

      return {
        name,
        qty,
        price: bookData.price, // Fetch price from the books data
      };
    })
    .filter((book) => book !== null); // Remove null entries

  // Check if there are valid books to add
  if (books.length === 0) {
    alert("No valid books found. Order not added.");
    return; // Prevent adding the order
  }

  const totalPrice = books.reduce(
    (acc, book) => acc + book.price * book.qty,
    0
  );
  const totalQty = books.reduce((acc, book) => acc + book.qty, 0);

  const newOrder = {
    id: parseInt(document.getElementById("order-id").value),
    books,
    totalPrice,
    totalQty,
  };

  if (isUpdating) {
    orders[updatingIndex] = newOrder;
  } else {
    orders.push(newOrder);
  }

  saveOrders(orders);
  renderOrders();
  modal.style.display = "none";
});

function updateOrder(index) {
  const orders = getOrders();
  const order = orders[index];

  document.getElementById("modal-title").innerText = "Update Order";
  document.getElementById("order-id").value = order.id;

  const booksSection = document.getElementById("books-section");
  booksSection.innerHTML = "";

  order.books.forEach((book) => {
    booksSection.insertAdjacentHTML(
      "beforeend",
      createBookEntry(book.name, book.qty, book.price)
    );
  });

  modal.style.display = "block";
  isUpdating = true;
  updatingIndex = index;
}

function deleteOrder(index) {
  const orders = getOrders();
  const order = orders[index];

  // Add confirmation prompt
  const confirmation = confirm(
    `Are you sure you want to delete the order with ID ${order.id}?`
  );

  if (confirmation) {
    // Remove the order if confirmed
    orders.splice(index, 1);
    saveOrders(orders);
    renderOrders();
    alert(`Order with ID ${order.id} has been deleted.`);
  }
}

function renderOrders() {
  const orders = getOrders();
  const orderContainer = document.querySelector(".order-container");
  orderContainer.innerHTML = "";

  orders.forEach((order, index) => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");

    const booksHtml = order.books
      .map(
        (book) => `
            <p id="book-name">${book.name}: <span id="book-qty">${book.qty}</span> <span id="book-price">${book.price}$</span></p>
        `
      )
      .join("");

    orderCard.innerHTML = `
            <h2 id="card-header">${order.id}</h2>
            ${booksHtml}
            <p id="total-price">Total price: <span>${order.totalPrice}$</span></p>
            <p id="total-qty">Total quantity: <span>${order.totalQty}</span></p>
            <div id="Buttons">
                <button class="update-btn" onclick="updateOrder(${index})">Update</button>
                <button class="delete-btn" onclick="deleteOrder(${index})">Delete</button>
            </div>
        `;

    orderContainer.appendChild(orderCard);
  });
}

function createBookEntry(name = "", qty = "", price = "") {
  return `
        <div class="book-entry">
            <input type="text" class="book-name" value="${name}" required placeholder="Book Name">
            <input type="number" class="book-qty" value="${qty}" required placeholder="Quantity">
            <input type="number" class="book-price" value="${price}" required placeholder="Price" readonly>
        </div>
    `;
}

function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function loadBooksData() {
  const storedData = localStorage.getItem("kutubhub_data");
  if (storedData) {
    booksData = JSON.parse(storedData).products;
  } else {
    // Handle the case where no data is available
    console.error("No book data found in local storage.");
  }
}
