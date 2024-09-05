const url = "project.json";
let t = document.getElementById("specifications");
let productsData = [];

async function loadProducts() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    productsData = await response.json();
    if (productsData.products && productsData.products.length > 0) {
      displayProductList(productsData.products);
      // displayProductDetails(productItem);
      displayRecommendations(productsData.recommendations);
    } else {
      console.error("No products found.");
    }
  } catch (error) {
    console.error("Error loading products", error);
  }
}
t.style.display = "none";

function displayProductList(products) {
  const productPage = document.getElementById("product-page");
  const productList = document.createElement("div");
  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-item");
    productItem.dataset.productId = product.id;

    let i = document.createElement("img");

    i.classList.add("imgCLASS");
    productItem.innerHTML = `
                <img src="${product.images[0]}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>${product.author}</p>
                    <p>${product.description}</p>
                    <p>${product.price + "$"}</p>
                    <p>${product.category}</p>
                    <button class="view-details">View Details</button>
                    <button class="add-cart">ADD TO CART</button>
                `;
    productItem.querySelector(".view-details").addEventListener("click", () => {
      displayProductDetails(product);
      displayRecommendations(product.category);
    });
    productItem.querySelector(".add-cart").addEventListener("click", () => {
      addToCart(product);
    });

    productList.appendChild(productItem);
  });
  productPage.appendChild(productList);
}

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
  productPrice.textContent = `Price: ${product.price + "$"}`;
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
    (p) => p.category === category
  );
  if (recommendedProducts.length > 0) {
    recommendedProducts.forEach((product) => {
      const recommendationItem = document.createElement("div");
      recommendationItem.classList.add("recommendation-item");

      recommendationItem.innerHTML = `
            :
                <img src="${product.images[0]}" alt="${product.title}">
                <h4>${product.title}</h4>
                <p>Price: ${product.price}$</p>
                <button class="view-details">View Details</button>
                <button class="add-to-cart"> Add To Cart</button>
                <div class="detailsR">
                    <p>Author: ${product.author}</p>
                    <p>Description: ${product.description}</p>
                </div>
            `;

      const detailsSection = recommendationItem.querySelector(".detailsR");
      recommendationItem
        .querySelector(".view-details")
        .addEventListener("click", () => {
          detailsSection.classList.toggle("active");
        });
      recommendationItem
        .querySelector(".add-to-cart")
        .addEventListener("click", () => {
          addToCartt(product);
        });

      recommendedList.appendChild(recommendationItem);
    });
  }
}

function VIEWDETAILS(recomProduct) {
  const detailsR = document.createElement("table");
  detailsR.classList.add("tableR");

  const specLanguageR = document.createElement("li");
  const specLanguageP = document.createElement("li");
  const specLanguagePUB = document.createElement("li");
  const specLanguageISBN = document.createElement("li");

  specLanguageR.textContent = `Language: ${recomProduct.specifications.language}`;
  specLanguageP.textContent = `Pages: ${recomProduct.specifications.pages}`;
  specLanguagePUB.textContent = `Publisher: ${recomProduct.specifications.publisher}`;
  specLanguageISBN.textContent = `ISBN: ${recomProduct.specifications.ISBN}`;

  const detailsList = document.createElement("ul");
  detailsList.classList.add("detailsR");

  detailsList.appendChild(specLanguageR);
  detailsList.appendChild(specLanguageP);
  detailsList.appendChild(specLanguagePUB);
  detailsList.appendChild(specLanguageISBN);

  detailsR.appendChild(detailsList);

  const recommendedList = document.getElementById("recommended-list"); // Reference to the recommended list container
  recommendedList.appendChild(detailsR);
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
  console.log(books);
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
  container.style.width = "100%";
  container.style.height = "100%";
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
      images: ["imgs/book1.jpeg"],
    },
    {
      productId: 2,
      title: "Blue Blooded",
      author: "Toni Morrison",
      description: "A powerful story exploring racial identity and heritage.",
      price: 12.99,
      category: "Literary Fiction",
      images: ["imgs/book2.jpeg"],
    },
    {
      productId: 3,
      title: "The Book Thief",
      author: "Markus Zusak",
      description:
        "A heart-wrenching tale set during World War II, narrated by Death.",
      price: 10.99,
      category: "Historical Fiction",
      images: ["imgs/book3.jpeg"],
    },
  ],
};

// Initialize cart if not already present
function initializeCart() {
    let cart = localStorage.getItem('cart');
    if (!cart) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

function addToCart(productId, quantity = 1) {  
    // Ensure the cart is an array
    let cart = JSON.parse(localStorage.getItem('cart'));
    if (!Array.isArray(cart)) {
        cart = []; 
    }
    
    // Get the product information from the products list
    const product = jsonData.products.find(p => p.productId === productId);
    
    if (!product) {
        console.error("Product not found");
        return;
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(item => item.productId === productId);
    
    if (existingProductIndex !== -1) {
        // If product exists in the cart, update the quantity
        cart[existingProductIndex].quantity += quantity;
        cart[existingProductIndex].priceTotal = cart[existingProductIndex].quantity * product.price;
    } else {
        // If product doesn't exist, add it to the cart with the quantity and total price
        cart.push({
            productId: product.productId,
            title: product.title,
            price: product.price,  // Store the price of each product
            quantity: quantity,
            priceTotal: product.price * quantity
        });
    }

    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
   viewCart();
}
// Function to view the current cart contents (for testing/debugging)
function viewCart() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    console.log(cart);
}

// Initialize cart on page load
initializeCart();

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
      addButton.addEventListener("click", () => addToCart(product.productId, 1));
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
// Display bundles when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", displayBundles);

loadProducts();
