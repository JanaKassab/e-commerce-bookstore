'use strict';

// Elements
// Cart Total
const spanSubtotalEl = document.getElementById('subtotal');
const spanDeliveryEl = document.getElementById('delivery');
const spanDiscount = document.getElementById('discount');
// first parent is p tag then div
const divDiscount = spanDiscount.parentElement.parentElement;
const spanTotal = document.getElementById('total');
const spanOldTotal = document.getElementById('oldTotal');
const btnCheckout = document.querySelector('.cart-total button');
// Coupon
const inputCouponCode = document.getElementById('coupon-code');
const btnApplyCoupon = document.querySelector('.coupon-code button');
// Items
const itemsContainer = document.querySelector('.items');
// Pagination
const linksContainer = document.querySelector('.page-number-container');
const ITEMS_PER_PAGE = 3;
let currentPage = 1;

// Get Books from Local Storage
let books = JSON.parse(localStorage.getItem('books')) || [];

// Utility function to update the book data in localStorage
function updateBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

// Make discount initially display none
divDiscount.style.display = 'none';

// Functions

// Function to display items based on the current page
function displayBooks() {
  const h2Element = document.querySelector('.items h2');

  // Clear existing items
  const existingItems = document.querySelectorAll('.items .item');
  existingItems.forEach(item => item.remove());

  // Check if there are any books in the local storage
  if (books.length === 0) {
    h2Element.textContent = 'Cart is Empty';
    return;
  }

  // Determine the range of items to display
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const booksToDisplay = books.slice(startIndex, endIndex);

  booksToDisplay.forEach((book, index) => {
    // Destructure book
    const {
      productId,
      title,
      author,
      description,
      images: [imgPath],
      price,
      quantity,
    } = book;
    // Step 2: Create a new HTML element
    const newElement = document.createElement('div');
    newElement.innerHTML = `<!-- Single Product -->
          <div class="item-info">
            <img src="${imgPath}" alt="${title}"/>
            <div class="info">
              <h4>${title} by ${author}</h4>
              <p>${description}</p>
            </div>
          </div>
          <div>
            <button class="sub-btn" onclick="handleItemAction(${productId}, 'sub')">-</button>
            <input class="qty-input" type="number" disabled value=${quantity} />
            <button class="add-btn" onclick="handleItemAction(${productId}, 'add')">+</button>
          </div>
          <p>$${price * quantity}</p>
          <button class="remove-btn" onclick="handleItemAction(${productId}, 'delete')"></button>`;
    newElement.classList.add('item');
    // Step 3: Append the new element right after the <h2> element
    h2Element.insertAdjacentElement('afterend', newElement);
  });
}

// Function to create pagination links
function createLinks() {
  // Clear existing links
  linksContainer.innerHTML = '';

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const newElement = document.createElement('li');
    newElement.classList.add('link');
    if (i === currentPage) newElement.classList.add('active');
    newElement.textContent = i;
    newElement.dataset.page = i;
    newElement.onclick = setActiveLink;
    linksContainer.appendChild(newElement);
  }
}

// Function to set the active pagination link
function setActiveLink(event) {
  const links = document.querySelectorAll('.page-number-container .link');
  links.forEach(link => link.classList.remove('active'));
  event.target.classList.add('active');
  currentPage = parseInt(event.target.dataset.page);
  displayBooks();
}

// Function to go to the previous page
function backBtn() {
  if (currentPage > 1) {
    currentPage--;
    updateUI();

    // Scroll to the top of the items container
    document.querySelector('.items').scrollIntoView({ behavior: 'smooth' });
  }
}

// Function to go to the next page
function nextBtn() {
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    updateUI();

    // Scroll to the top of the items container
    document.querySelector('.items').scrollIntoView({ behavior: 'smooth' });
  }
}

// Update UI
function updateUI() {
  displayBooks();
  createLinks();
}
// Function to handle item actions (add, sub, delete)
function handleItemAction(itemId, action) {
  if (!action || !itemId) return;

  const book = books.find(book => book.productId === itemId);

  if (book) {
    switch (action) {
      case 'add':
        ++book.quantity;
        break;
      case 'sub':
        if (book.quantity > 1) --book.quantity;
        else {
          books = books.filter(book => book.productId !== itemId);
        }
        break;
      case 'delete':
        books = books.filter(book => book.productId !== itemId);
        break;
    }
    updateBooks();
    calculateFinalPrice();
    updateUI();
  }
}

function calculateTotalPrice() {
  let totalPrice = 0;
  books.forEach(book => {
    totalPrice += book.price * book.quantity;
  });
  spanSubtotalEl.textContent = spanOldTotal.textContent = totalPrice.toFixed(2);
  return totalPrice.toFixed(2);
}

function calculateFinalPrice(discountValue) {
  const totalPrice = calculateTotalPrice();
  let isEqual = true;
  if (+discountValue) {
    spanDiscount.textContent = discountValue * totalPrice;
    isEqual = false;
  } else {
    discountValue = 1;
  }
  const finalPrice = totalPrice - discountValue * totalPrice + 3;
  if (discountValue > 1) {
    spanOldTotal.style.display = 'inline-block';
    spanTotal.style.color = '#50C878';
    spanTotal.style.fontWeight = 'bolder';
  }
  spanTotal.textContent = finalPrice.toFixed(2);
}

// Call Functions on Load
displayBooks();
createLinks();
calculateFinalPrice();

// Coupons array with multiple coupon codes
const coupons = [
  { code: 'a4s6zx', expiration: '8/29/2024', discount: '10%' },
  { code: 'test', expiration: '8/29/2524', discount: '10%' },
  { code: 'booklover', expiration: '9/25/2024', discount: '35%' },
];

// Event Listeners
btnApplyCoupon.addEventListener('click', () => {
  const coupon = inputCouponCode.value.trim();
  if (!coupon) {
    console.error('Invalid Input');
    return;
  }
  inputCouponCode.value = '';

  // Find the coupon object that matches the entered code
  const couponObject = coupons.find(couponItem => couponItem.code === coupon);

  if (couponObject) {
    const discount = parseInt(couponObject.discount, 10);
    // Check if the coupon is expired
    const currentDate = new Date();
    const expirationDate = new Date(couponObject.expiration);

    if (currentDate > expirationDate) {
      inputCouponCode.placeholder = 'Coupon Expired';
    } else {
      divDiscount.style.display = 'flex';
      calculateFinalPrice(discount / 100);
    }
  } else {
    inputCouponCode.placeholder = 'Invalid Coupon';
  }
});

// Target checkout btn
btnCheckout.addEventListener('click', () => {
  // Go to Checkout.html
  window.location.href = 'checkout.html';
});
