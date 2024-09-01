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

function addToCart(isbn) {
  const product = productsData.products.find(
    (p) => p.specifications.ISBN === isbn
  );
  if (product) {
    cart.push(product);
    alert(`${product.title} has been added to your cart!`);
  }
}

// Load products when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadProductDetails);
