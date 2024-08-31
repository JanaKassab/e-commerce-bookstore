let booksData = [];
let currentBook = null; // To store the book being edited

document.addEventListener("DOMContentLoaded", function () {
  // Load navigation
  fetch("Navigation.html")
    .then(response => response.text())
    .then(data => {
      const navPlaceholder = document.getElementById("Nav-placeholder");
      if (navPlaceholder) {
        navPlaceholder.innerHTML = data;
      }
    })
    .catch(error => console.error("Error loading navigation:", error));

  // Initialize books data
  let storedData = localStorage.getItem("kutubhub_data");
  if (storedData) {
    booksData = JSON.parse(storedData).products;
  } else {
    fetch("kutubhub_data.json")
      .then(response => response.json())
      .then(data => {
        booksData = data.products;
        saveChangesToJson(booksData); // Store initial data in localStorage
      })
      .catch(error => console.error("Error fetching data:", error));
  }

  initializeBookCards(booksData);

  // Add book form
  const productForm = document.getElementById("ProductForm");
  if (productForm) {
    productForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form values
      const title = document.getElementById("Title").value;
      const isbn = document.getElementById("ISBN").value;
      const author = document.getElementById("Author").value;
      const price = parseFloat(document.getElementById("Price").value);
      const category = document.getElementById("Category").value;
      const language = document.getElementById("Languages").value;
      const description = document.getElementById("Description").value;
      const publisher = document.getElementById("Publisher").value;
      const imageFile = document.getElementById("image").files[0]; // File input

      // Check if the book already exists
      const existingBook = booksData.find(book => book.isbn === isbn);
      if (existingBook) {
        alert("A book with this ISBN already exists.");
        return;
      }

      // Read the image if it exists
      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = function () {
          const imageUrl = reader.result; // Base64 data URL

          // Create a new book object
          const newBook = {
            title,
            isbn,
            author,
            price,
            category,
            language,
            description,
            publisher,
            images: [imageUrl], // Use the Base64 data URL
          };

          // Add the new book to booksData and save
          booksData.push(newBook);
          saveChangesToJson(booksData);
          initializeBookCards(booksData);
          productForm.reset();

          alert("Book added successfully!");
        };

        reader.readAsDataURL(imageFile); // Read image file as Data URL
      } else {
        // Create a new book object without an image
        const newBook = {
          title,
          isbn,
          author,
          price,
          category,
          language,
          description,
          publisher,
          images: [], // No image
        };

        // Add the new book to booksData and save
        booksData.push(newBook);
        saveChangesToJson(booksData);
        initializeBookCards(booksData);
        productForm.reset();

        alert("Book added successfully!");
      }
    });
  }

  // Handle the update functionality
  const updateBookForm = document.getElementById("updateBookForm");
  if (updateBookForm) {
    updateBookForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (currentBook) {
        currentBook.title = document.getElementById("bookTitle").value;
        currentBook.author = document.getElementById("bookAuthor").value;
        currentBook.price = parseFloat(document.getElementById("bookPrice").value);
        currentBook.category = document.getElementById("bookCategory").value;

        saveChangesToJson(booksData);

        alert("Book updated successfully!");
        document.getElementById("updateBookModal").style.display = "none";
        initializeBookCards(booksData);
      }
    });
  }

  // Handle modal close
  const closeModalBtn = document.querySelector(".modal .close-btn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      document.getElementById("updateBookModal").style.display = "none";
    });
  }

  function calculateTotalSales() {
    // Retrieve orders from localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Calculate the total sales by summing up the totalPrice of each order
    let totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Display the total sales in the UI
    document.querySelector(".stat-card .details #totalSale").textContent = `$${totalSales.toFixed(2)}`;
  }

  // Calculate and display the total sales when the page loads
  calculateTotalSales();

  // Function to calculate the total number of orders
  function calculateTotalOrders() {
    // Retrieve orders from localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Count the total number of orders
    let totalOrders = orders.length;

    // Display the total orders in the UI
    document.querySelector(".stat-card .details #totalOrder").textContent = totalOrders;
  }

  // Calculate and display the total orders when the page loads
  calculateTotalOrders();

  function calculateTotalProducts() {
    const data = JSON.parse(localStorage.getItem("kutubhub_data")) || {};
    const products = data.products || [];
    const totalProducts = products.length;
    document.querySelector(".stat-card .details #totalProduct").textContent = totalProducts;
  }

  // Call this function to update the UI
  calculateTotalProducts();

  function calculateTopProducts() {
    // Retrieve and parse the products and orders from localStorage
    const productsData = JSON.parse(localStorage.getItem("kutubhub_data")) || {};
    const ordersData = JSON.parse(localStorage.getItem("orders")) || [];

    // Check if orders exist
    if (ordersData.length === 0) {
      console.warn("No orders to process.");
      return;
    }

    // Create a dictionary to hold the total units sold for each product
    const productSales = {};

    // Aggregate sales data
    ordersData.forEach(order => {
      order.books.forEach(book => {
        if (productSales[book.name]) {
          productSales[book.name] += book.qty;
        } else {
          productSales[book.name] = book.qty;
        }
      });
    });

    // Convert the dictionary to an array and sort by units sold
    const sortedProducts = Object.entries(productSales)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty);

    console.log("Sorted Products:", sortedProducts); // Check sorted product list

    // Populate the table with top products
    const tbody = document.querySelector(".top-products tbody");
    if (!tbody) {
      console.error("Table body not found.");
      return;
    }

    tbody.innerHTML = ""; // Clear existing rows

    sortedProducts.forEach(product => {
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      const qtyCell = document.createElement("td");

      nameCell.textContent = product.name;
      qtyCell.textContent = product.qty;

      row.appendChild(nameCell);
      row.appendChild(qtyCell);
      tbody.appendChild(row);
    });
  }

  calculateTopProducts();
});

function initializeBookCards(books) {
  const container = document.getElementById("book-cards-container");
  if (container) {
    container.innerHTML = "";

    books.forEach(book => {
      const card = document.createElement("div");
      card.className = "book-card";

      const img = document.createElement("img");
      img.src = book.images[0];
      img.alt = book.title;
      card.appendChild(img);

      const title = document.createElement("h3");
      title.textContent = book.title;
      card.appendChild(title);

      const author = document.createElement("p");
      author.textContent = `Author: ${book.author}`;
      card.appendChild(author);

      const price = document.createElement("p");
      price.textContent = `Price: $${book.price}`;
      card.appendChild(price);

      const category = document.createElement("p");
      category.textContent = `Category: ${book.category}`;
      card.appendChild(category);

      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "buttons";

      const updateButton = document.createElement("button");
      updateButton.className = "update-btn";
      updateButton.textContent = "Update";
      updateButton.addEventListener("click", () => openUpdateModal(book));
      buttonsContainer.appendChild(updateButton);

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => handleDelete(book, card));
      buttonsContainer.appendChild(deleteButton);

      card.appendChild(buttonsContainer);

      container.appendChild(card);
    });
  }
}

function openUpdateModal(book) {
  currentBook = book;

  document.getElementById("bookTitle").value = book.title;
  document.getElementById("bookAuthor").value = book.author;
  document.getElementById("bookPrice").value = book.price;
  document.getElementById("bookCategory").value = book.category;

  document.getElementById("updateBookModal").style.display = "block";
}

function handleDelete(book, cardElement) {
  if (confirm("Are you sure you want to delete this book?")) {
    booksData = booksData.filter(b => b.isbn !== book.isbn);
    saveChangesToJson(booksData);
    cardElement.remove();
    alert("Book deleted successfully!");
  }
}

function saveChangesToJson(data) {
  localStorage.setItem("kutubhub_data", JSON.stringify({ products: data }));
}
