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
// Coupon
const inputCouponCode = document.getElementById('coupon-code');
const btnApplyCoupon = document.querySelector('.coupon-code button');
// Items
const itemsContainer = document.querySelector('.items');
// Pagination
const linksContainer = document.querySelector('.page-number-container');
const ITEMS_PER_PAGE = 3;
const btnBack = document.querySelector('.prev');
const btnNext = document.querySelector('.next');

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
            <input class="qty-input" type="number" disabled value=${
              quantity ? quantity : 1
            } />
            <button class="add-btn" onclick="handleItemAction(${productId}, 'add')">+</button>
          </div>
          <p>$${price * (quantity ? quantity : 1)}</p>
          <button class="remove-btn" onclick="handleItemAction(${productId}, 'delete')"></button>`;
    newElement.classList.add('item');
    // Step 3: Append the new element right after the <h2> element
    h2Element.insertAdjacentElement('afterend', newElement);
  });
}

// Function to create pagination links
let currentPage = 1;
let prevPage = 1;
let startPage = 1;
let endPage = 3;
function createLinks() {
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  btnBack.disabled = false;
  btnNext.disabled = false;
  if (currentPage === 1) btnBack.disabled = true;
  if (currentPage === totalPages) btnNext.disabled = true;
  // disable btns if can't go further
  // Clear existing links
  linksContainer.innerHTML = '';
  // Make sure it stays within range
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  // Passed last visible page
  if (currentPage === endPage + 1 && currentPage !== totalPages) {
    startPage = currentPage;
    endPage = Math.min(currentPage + 2, totalPages);
  }
  // No More pages
  if (currentPage === totalPages && totalPages !== 1) {
    startPage = currentPage - 2;
    endPage = currentPage;
  }
  // Only 1 page
  if (currentPage === totalPages && totalPages === 1) {
    startPage = endPage = 1;
  }
  // prev > current means going backward
  // 4 > 3 true && 3 === 4 - 1 true
  if (prevPage > currentPage && currentPage === startPage - 1) {
    startPage = Math.max(1, currentPage - 2);
    endPage = Math.max(currentPage, 3);
  }

  for (let i = startPage; i <= endPage; i++) {
    const newElement = document.createElement('li');
    newElement.classList.add('link');
    if (i === currentPage) newElement.classList.add('active');
    newElement.textContent = i;
    newElement.dataset.page = i;
    newElement.onclick = setActiveLink;
    linksContainer.appendChild(newElement);
  }
  // Update PrevPage
  prevPage = currentPage;
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

  if (!book.quantity) book.quantity = 1;

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

function checkout() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  if (!loggedInUser) {
    alert('You are not logged in');
    window.location.href = '../Login-Signup/login&SignUp.html';
  }
  const userName = loggedInUser.username;
  if (loggedInUser.username === userName) {
    // If user is logged in, proceed to checkout
    updateBooks();
    window.location.href = '../Checkout/checkoutPage.html';
  }
}

function clearCart() {
  localStorage.removeItem('books');
  books = JSON.parse(localStorage.getItem('books')) || [];
  calculateFinalPrice();
  updateUI();
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
  let discount = parseFloat(discountValue);

  // Handle cases where discountValue is not a number or is zero
  if (isNaN(discount) || discount <= 0) {
    discount = 0;
  }

  // Calculate the discount amount and final price
  const discountAmount = discount * totalPrice;
  const finalPrice = totalPrice - discountAmount + 3;

  // Update the discount display
  spanDiscount.textContent = discountAmount.toFixed(2);

  // Update the display for old total and total price
  if (discount > 0) {
    spanOldTotal.style.display = 'inline-block';
    spanTotal.style.color = '#50C878';
    spanTotal.style.fontWeight = 'bolder';
  } else {
    spanOldTotal.style.display = 'none';
    spanTotal.style.color = '';
    spanTotal.style.fontWeight = '';
  }

  // Display the final price
  spanTotal.textContent = finalPrice.toFixed(2);
}

// Coupon Fns
function parseCoupon(coupon) {
  // Make value from % to number, from date to big date number
  return {
    ...coupon,
    discount: parseInt(coupon.discount, 10),
    expiration: new Date(coupon.expiration),
  };
}

function isCouponExpired(expirationDate) {
  return new Date() > expirationDate;
}

function applyCoupon(coupon) {
  divDiscount.style.display = 'flex';
  localStorage.setItem('coupon', JSON.stringify(coupon));
  calculateFinalPrice(coupon.discount / 100);
}

function handleInvalidCoupon(message) {
  inputCouponCode.placeholder = message;
  calculateFinalPrice();
}

// Check and apply coupon if it exists in localStorage
const storedCoupon = JSON.parse(localStorage.getItem('coupon'));
if (storedCoupon) {
  const parsedCoupon = parseCoupon(storedCoupon);
  if (isCouponExpired(parsedCoupon.expiration)) {
    handleInvalidCoupon('Coupon Expired');
  } else {
    applyCoupon(parsedCoupon);
  }
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
  const couponCode = inputCouponCode.value.trim();
  if (!couponCode) {
    console.error('Invalid Input');
    return;
  }
  inputCouponCode.value = '';

  // Find the coupon object that matches the entered code
  const couponObject = coupons.find(
    couponItem => couponItem.code === couponCode
  );

  if (couponObject) {
    const parsedCoupon = parseCoupon(couponObject);
    if (isCouponExpired(parsedCoupon.expiration)) {
      handleInvalidCoupon('Coupon Expired');
    } else {
      applyCoupon(parsedCoupon);
    }
  } else {
    handleInvalidCoupon('Invalid Coupon');
  }
});
