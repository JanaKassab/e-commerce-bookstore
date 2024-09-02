let t = document.getElementById('specifications');
let productsData = [];
const cart = [];

function getISBNFromURL() {
  const params = new URLSearchParams(window.location.search);
  const isbn = params.get('isbn'); // Ensure 'isbn' parameter is retrieved correctly
  console.log('ISBN from URL:', isbn); // Debugging output to check if the ISBN is being retrieved
  return isbn;
}

async function loadProductDetails() {
  try {
    const isbn = getISBNFromURL(); // Get ISBN from URL

    const response = await fetch('../database/kutubhub_data.json'); // Fetch your JSON data
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    productsData = await response.json(); // Store the fetched data globally
    console.log('Products Data Loaded:', productsData); // Debugging

    const product = productsData.products.find(
      book => book.specifications.ISBN === isbn
    );

    if (product) {
      displayProductDetails(product); // Display product details
      displayRecommendations(product.category); // Display related recommendations
    } else {
      console.error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
}
// Call the function to load product details when the page loads
document.addEventListener('DOMContentLoaded', loadProductDetails);
function displayProductDetails(product) {
  t.style.display = 'flex';
  const productTitle = document.getElementById('product-title');
  const productPrice = document.getElementById('product-price');
  const productAuthor = document.getElementById('product-author');
  const productCategory = document.getElementById('product-category');
  const productDescription = document.getElementById('product-description');
  const specLanguage = document.getElementById('spec-language');
  const specPages = document.getElementById('spec-pages');
  const specPublisher = document.getElementById('spec-publisher');
  const specIsbn = document.getElementById('spec-isbn');
  const mainImage = document.getElementById('main-image');
  productTitle.textContent = product.title;
  productPrice.textContent = `Price: ${product.price}$`;
  productAuthor.textContent = `Author: ${product.author}`;
  productCategory.textContent = `Category: ${product.category}`;
  productDescription.textContent = `Description: ${product.description}`;
  specLanguage.textContent = product.specifications.language;
  specPages.textContent = product.specifications.pages;
  specPublisher.textContent = product.specifications.publisher;
  specIsbn.textContent = product.specifications.ISBN;
  mainImage.src = product.images[0] || '';
  createZoomContainer(mainImage);
  document
    .getElementById('product-details')
    .scrollIntoView({ behavior: 'smooth' });
}
function displayRecommendations(category) {
  const recommendedList = document.getElementById('recommended-list');
  recommendedList.innerHTML = '';
  const recommendedProducts = productsData.products.filter(
    p => p.category === category && p.specifications.ISBN !== getISBNFromURL()
  );
  if (recommendedProducts.length > 0) {
    recommendedProducts.forEach(product => {
      const recommendationItem = document.createElement('div');
      recommendationItem.classList.add('recommendation-item');
      recommendationItem.innerHTML = `
                <img src="${product.images[0]}" alt="${product.title}">
                <h4>${product.title}</h4>
                <p>Price: ${product.price}$</p>
                <button class="view-details">View Details</button>
            `;
      const viewDetailsButton =
        recommendationItem.querySelector('.view-details');
      if (viewDetailsButton) {
        viewDetailsButton.addEventListener('click', () => {
          window.location.href = `detailedPage.html?isbn=${product.specifications.ISBN}`;
        });
      } else {
        console.error('View Details button not found in recommendation item.');
      }
      recommendedList.appendChild(recommendationItem);
    });
  }
}
function createZoomContainer(imageElement) {
  const container = document.createElement('div');
  container.className = 'zoom-container';
  const zoomedImage = document.createElement('img');
  zoomedImage.src = imageElement.src;
  zoomedImage.className = 'zoomed-image';
  container.appendChild(zoomedImage);
  document.body.appendChild(container);
  // Style zoom container
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.zIndex = '1000';
  container.style.cursor = 'zoom-out';
  container.style.display = 'none';
  imageElement.addEventListener('click', () => {
    container.style.display = 'flex';
  });
  container.addEventListener('click', () => {
    container.style.display = 'none';
  });
}
function addToCart() {
  const isbn = getISBNFromURL();
  console.log('Adding to cart:', isbn); // Debugging

  const product = productsData.products.find(
    p => p.specifications.ISBN === isbn
  );

  if (product) {
    console.log('Product found:', product); // Debugging

    // Load existing cart from localStorage
    let existingCart = JSON.parse(localStorage.getItem('books')) || [];

    // Check if the product already exists in the cart
    const existingProduct = existingCart.find(
      p => p.specifications.ISBN === isbn
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      existingCart.push(product);
    }

    // Save the updated cart to localStorage
    localStorage.setItem('books', JSON.stringify(existingCart));
    alert(`${product.title} has been added to your cart!`);
  } else {
    console.error('Product not found for ISBN:', isbn);
  }
}

// Function to display bundles
function displayBundle() {
  const bundleSection = document.getElementById('bundle-section');
  bundleSection.innerHTML = ''; // Clear any existing content
  jsonData.bundles.forEach(bundle => {
    // Create a container for each bundle
    const bundleContainer = document.createElement('div');
    bundleContainer.classList.add('bundle');
    // Bundle header
    const bundleHeader = document.createElement('div');
    bundleHeader.classList.add('bundle-header');
    bundleHeader.innerHTML = `
      <div class="bundle-info">
        <h2>${bundle.bundleName}</h2>
      </div>
      <div class="bundle-pricing">
        <p class="discount">Discount: ${bundle.discount}</p>
        <h3>Price After Discount: $${bundle.priceAfterDiscount.toFixed(2)}</h3>
        <button class="add-to-cart" onclick="addToCart()">Add To Cart</button>
      </div>
    `;
    bundleContainer.appendChild(bundleHeader);
    // Check if the button exists before adding the event listener
    const addToCartButton = bundleContainer.querySelector('.add-to-cart');
    if (addToCartButton) {
      addToCartButton.addEventListener('click', () => {
        // Define `product` based on the bundle
        const product = jsonData.products.find(
          p => p.productId === bundle.products[0]
        ); // Adjust as needed
        if (product) {
          addToCart(product.specifications.ISBN);
        } else {
          console.error('Product not found for adding to cart.');
        }
      });
    } else {
      console.error('Add to Cart button not found in bundle.');
    }
    // Bundle products
    const productList = document.createElement('div');
    productList.classList.add('products');
    bundle.products.forEach(productId => {
      const product = jsonData.products.find(p => p.productId === productId);
      if (product) {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
          <div class="product-image">
            <img src="${product.images[0]}" alt="${product.title}">
          </div>
          <div class="product-details">
            <h3>${product.title}</h3>
            <p>Author: ${product.author}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
          </div>
          <div class="product-buttons">
            <button class="view-details">View Details</button>
          </div>
        `;
        const viewDetailsButton = productItem.querySelector('.view-details');
        if (viewDetailsButton) {
          viewDetailsButton.addEventListener('click', () => {
            window.location.href = `detailedPage.html?isbn=${encodeURIComponent(
              product.specifications.ISBN
            )}`;
          });
        } else {
          console.error('View Details button not found in product item.');
        }
        productList.appendChild(productItem);
      } else {
        console.error('Product not found for productId:', productId);
      }
    });
    bundleContainer.appendChild(productList);
    bundleSection.appendChild(bundleContainer);
  });
}
// Call the function to display bundles
displayBundle();
