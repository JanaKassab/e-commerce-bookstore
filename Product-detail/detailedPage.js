let t = document.getElementById("specifications");
let productsData = [];

// Function to get ISBN from URL
function getISBNFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("isbn");
}

async function loadProductDetails() {
  try {
    const isbn = getISBNFromURL(); // Get ISBN from URL
    const response = await fetch("../database/kutubhub_data.json"); // Fetch your JSON data
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    productsData = await response.json(); // Store the fetched data globally
    const product = productsData.products.find(
      (book) => book.specifications.ISBN === isbn
    );

    if (product) {
      displayProductDetails(product); // Display product details
      displayRecommendations(product.category); // Display related recommendations
    } else {
      console.error("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

// Call the function to load product details when the page loads
loadProductDetails();

t.style.display = "none";

function displayProductDetails(product) {
  t.style.display = "flex";
  const productTitle = document.getElementById("product-title");
  const productPrice = document.getElementById("product-price");
  const productAuthor = document.getElementById("product-author");
  const productCategory = document.getElementById("product-category");
  const productDescription = document.getElementById("product-description");
  const specLanguage = document.getElementById("spec-language");
  const specPages = document.getElementById("spec-pages");
  const specPublisher = document.getElementById("spec-publisher");
  const specIsbn = document.getElementById("spec-isbn");
  const mainImage = document.getElementById("main-image");

  productTitle.textContent = product.title;
  productPrice.textContent = `Price: ${product.price}$`;
  productAuthor.textContent = `Author: ${product.author}`;
  productCategory.textContent = `Category: ${product.category}`;
  productDescription.textContent = `Description: ${product.description}`;
  specLanguage.textContent = product.specifications.language;
  specPages.textContent = product.specifications.pages;
  specPublisher.textContent = product.specifications.publisher;
  specIsbn.textContent = product.specifications.ISBN;
  mainImage.src = product.images[0] || "";

  createZoomContainer(mainImage);

  document
    .getElementById("product-details")
    .scrollIntoView({ behavior: "smooth" });
}

function displayRecommendations(category) {
  const recommendedList = document.getElementById("recommended-list");
  recommendedList.innerHTML = "";

  const recommendedProducts = productsData.products.filter(
    (p) => p.category === category && p.specifications.ISBN !== getISBNFromURL()
  );

  console.log("Recommended products:", recommendedProducts); // Debugging line

  if (recommendedProducts.length > 0) {
    recommendedProducts.forEach((product) => {
      const recommendationItem = document.createElement("div");
      recommendationItem.classList.add("recommendation-item");

      recommendationItem.innerHTML = `
                <img src="${product.images[0]}" alt="${product.title}">
                <h4>${product.title}</h4>
                <p>Price: ${product.price}$</p>
                <button class="view-details">View Details</button>
                <button class="add-to-cart" >Add To Cart</button>
                <div class="detailsR">
                    <p>Author: ${product.author}</p>
                    <p>Description: ${product.description}</p>
                </div>
            `;

      const detailsSection = recommendationItem.querySelector(".detailsR");
      recommendationItem
        .querySelector(".view-details")
        .addEventListener("click", () => {
          window.location.href = `detailedPage.html?isbn=${product.specifications.ISBN}`;
        });
      recommendationItem
        .querySelector(".add-to-cart")
        .addEventListener("click", () => {
          addToCart(product.specifications.ISBN);
        });

      recommendedList.appendChild(recommendationItem);
    });
  } else {
    recommendedList.innerHTML = "<p>No recommendations available.</p>";
  }
}

function createZoomContainer(imageElement) {
  const container = document.createElement("div");
  container.className = "zoom-container";

  const zoomedImage = document.createElement("img");
  zoomedImage.src = imageElement.src;
  zoomedImage.className = "zoomed-image";

  container.appendChild(zoomedImage);
  document.body.appendChild(container);

  // Style zoom container
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "50%";
  container.style.height = "50%";
  container.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.zIndex = "1000";
  container.style.cursor = "zoom-out";
  container.style.display = "none";

  imageElement.addEventListener("click", () => {
    container.style.display = "flex";
  });

  container.addEventListener("click", () => {
    container.style.display = "none";
  });
}

// Add To Cart fn
function addToCart(book) {
  // Check if has prop, if not add
  if (!book.quantity) {
    book.quantity = 1;
  } else {
    book.quantity++;
  }
  // Retrieve existing books from localStorage
  let books = JSON.parse(localStorage.getItem("books")) || [];
  // Check if the book already exists in the cart
  let existingBookIndex = books.findIndex(
    (b) => b.productId === book.productId
  );
  if (existingBookIndex !== -1) {
    books[existingBookIndex].quantity = book.quantity;
  } else {
    books.push(book);
    
  }
  // Save the updated books array back to localStorage
  localStorage.setItem("books", JSON.stringify(books));
  alert(`The book has been added to your cart!`);
  console.log(books);
}

// bundles:
// Static JSON data
const jsonData = {
  bundles: [
    {
      bundleId: 1,
      products: [1, 2, 3],
      bundleName: "Science and History Explorer Pack",
      discount: "15%",
      priceAfterDiscount: 51.98,
    },
  ],
  products: [
    {
      productId: 1,
      title: "The Hammer of Eden",
      author: "Ken Follett",
      description:
        "A gripping thriller about a plan to cause an earthquake to destroy a city.",
      price: 9.99,
      category: "Thrillers",
      images: ["../imgs/book1.jpeg"],
    },
    {
      productId: 2,
      title: "Blue Blooded",
      author: "Toni Morrison",
      description: "A powerful story exploring racial identity and heritage.",
      price: 12.99,
      category: "Literary Fiction",
      images: ["../imgs/book2.jpeg"],
    },
    {
      productId: 3,
      title: "The Book Thief",
      author: "../Markus Zusak",
      description:
        "A heart-wrenching tale set during World War II, narrated by Death.",
      price: 10.99,
      category: "Historical Fiction",
      images: ["../imgs/book3.jpeg"],
    },
  ],
};

// Initialize cart
let cart = [];

// Function to handle adding a product to the cart

function displayBundles() {
  const bundlesSection = document.getElementById("bundles-section");

  jsonData.bundles.forEach((bundle) => {
    const bundleElement = document.createElement("div");
    bundleElement.classList.add("bundle");

    const bundleTitle = document.createElement("h2");
    bundleTitle.textContent = bundle.bundleName;
    bundleElement.appendChild(bundleTitle);

    const productsContainer = document.createElement("div");
    productsContainer.classList.add("products");

    bundle.products.forEach((productId) => {
      const product = jsonData.products.find((p) => p.productId === productId);

      const productElement = document.createElement("div");
      productElement.classList.add("product");

      const img = document.createElement("img");
      img.src = product.images[0];
      img.alt = product.title;
      productElement.appendChild(img);

      const title = document.createElement("p");
      title.textContent = product.title;
      productElement.appendChild(title);

      const addButton = document.createElement("button");
      addButton.textContent = "Add to Cart";
      addButton.addEventListener("click", () => addToCart(productId));
      productElement.appendChild(addButton);

      productsContainer.appendChild(productElement);
    });

    bundleElement.appendChild(productsContainer);

    const discount = document.createElement("p");
    discount.classList.add("discount");
    discount.textContent = `Discount: ${
      bundle.discount
    } | Price After Discount: $${bundle.priceAfterDiscount.toFixed(2)}`;
    bundleElement.appendChild(discount);

    bundlesSection.appendChild(bundleElement);
  });
}


// Load products when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadProductDetails);

displayBundles();
