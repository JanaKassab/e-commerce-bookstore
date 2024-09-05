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

const jsonData = {
  bundles: [
    {
      bundleId: 1,
      products: [1, 2, 3],
      bundleName: 'Science and History Explorer Pack',
      discount: '15%',
      priceAfterDiscount: 51.98,
    },
  ],
  products: [
    {
      productId: 1,
      title: 'The Hammer of Eden',
      author: 'Ken Follett',
      description:
        'A gripping thriller about a plan to cause an earthquake to destroy a city.',
      price: 9.99,
      category: 'Thrillers',
      images: ['../img/book1.jpeg'],
    },
    {
      productId: 2,
      title: 'Blue Blooded',
      author: 'Toni Morrison',
      description: 'A powerful story exploring racial identity and heritage.',
      price: 12.99,
      category: 'Literary Fiction',
      images: ['../img/book2.jpeg'],
    },
    {
      productId: 3,
      title: 'The Book Thief',
      author: 'Markus Zusak',
      description:
        'A heart-wrenching tale set during World War II, narrated by Death.',
      price: 10.99,
      category: 'Historical Fiction',
      images: ['../img/book3.jpeg'],
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

// Function to display bundles
function displayBundles() {
    const bundlesSection = document.getElementById('bundles-section');
    bundlesSection.innerHTML = ''; // Clear existing content to prevent duplication

    jsonData.bundles.forEach(bundle => {
        const bundleElement = document.createElement('div');
        bundleElement.classList.add('bundle');

        const bundleTitle = document.createElement('h2');
        bundleTitle.textContent = bundle.bundleName;
        bundleElement.appendChild(bundleTitle);

        const productsContainer = document.createElement('div');
        productsContainer.classList.add('products');

        bundle.products.forEach(productId => {
            const product = jsonData.products.find(p => p.productId === productId);
            if (product) {
                const productElement = document.createElement('div');
                productElement.classList.add('product');

                const img = document.createElement('img');
                img.src = product.images[0];
                img.alt = product.title;
                productElement.appendChild(img);

                const title = document.createElement('p');
                title.textContent = product.title;
                productElement.appendChild(title);

                const addButton = document.createElement('button');
                addButton.textContent = 'Add to Cart';
                
                // Pass the correct quantity (1 in this case)
                addButton.addEventListener('click', () => addToCart(product.productId, 1));
                productElement.appendChild(addButton);

                productsContainer.appendChild(productElement);
            } else {
                console.error(`Product with ID ${productId} not found in bundle.`);
            }
        });

        bundleElement.appendChild(productsContainer);

        const discount = document.createElement('p');
        discount.classList.add('discount');
        discount.textContent = `Discount: ${bundle.discount} | Price After Discount: $${bundle.priceAfterDiscount.toFixed(2)}`;
        bundleElement.appendChild(discount);

        bundlesSection.appendChild(bundleElement);
    });
}

// Display bundles when the DOM is fully loaded
//document.addEventListener('DOMContentLoaded', displayBundles);
displayBundles();

// To view the cart after adding items (for debugging)
viewCart();

loadProducts();
