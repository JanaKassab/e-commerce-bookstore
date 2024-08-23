'use strict';

// Elements
// Cart Total
const spanSubtotalEl = document.getElementById('subtotal');
const spanDeliveryEl = document.getElementById('delivery');
const spanDiscount = document.getElementById('discount');
// first parent is p tag then div
const divDiscount = spanDiscount.parentElement.parentElement;
const spanTotal = document.getElementById('total');
const btnCheckout = document.querySelector('.cart-total button');
// Coupon
const inputCouponCode = document.getElementById('coupon-code');
const btnApplyCoupon = document.querySelector('.coupon-code button');
// Items
const itemsContainer = document.querySelector('.items');
// Pagination
const linksContainer = document.querySelector('.page-number-container');

// Variables
const itemsExample = Array.from({ length: 5 }, () => ({
  img: './48-laws-of-power-book.jpg',
  alt: '48 laws of power',
  name: '48 Laws of Power',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non optio quam laudantium officia, veniam animi.',
  price: 10,
}));

const ITEMS_PER_PAGE = 3;
let currentPage = 1;

// Make discount initially display none
divDiscount.style.display = 'none';

// Functions

// Function to display items based on the current page
function displayItems(items) {
  const h2Element = document.querySelector('.items h2');

  // Clear existing items
  const existingItems = document.querySelectorAll('.items .item');
  existingItems.forEach(item => item.remove());

  // Determine the range of items to display
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsToDisplay = items.slice(startIndex, endIndex);

  itemsToDisplay.forEach((item, index) => {
    // Step 2: Create a new HTML element
    const newElement = document.createElement('div');
    newElement.innerHTML = `<!-- Single Product -->
          <div class="item-info">
            <img src="${item.img}" alt="${item.alt}"/>
            <div class="info">
              <h4>${item.name}</h4>
              <p>${item.description}</p>
            </div>
          </div>
          <div>
            <button class="sub-btn" data-action="sub">-</button>
            <input class="qty-input" type="number" disabled value="0" />
            <button class="add-btn" data-action="add">+</button>
          </div>
          <p>$${item.price}</p>
          <button class="remove-btn" data-action="delete"></button>`;
    newElement.classList.add('item');
    newElement.dataset.index = startIndex + index;
    // Step 3: Append the new element right after the <h2> element
    h2Element.insertAdjacentElement('afterend', newElement);
  });
}

// Function to create pagination links
function createLinks(numItems) {
  // Clear existing links
  linksContainer.innerHTML = '';

  const totalPages = Math.ceil(numItems / ITEMS_PER_PAGE);

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
  displayItems(itemsExample);
}

// Function to go to the previous page
function backBtn() {
  if (currentPage > 1) {
    currentPage--;
    displayItems(itemsExample);
    createLinks(itemsExample.length);

    // Scroll to the top of the items container
    document.querySelector('.items').scrollIntoView({ behavior: 'smooth' });
  }
}

// Function to go to the next page
function nextBtn() {
  const totalPages = Math.ceil(itemsExample.length / ITEMS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    displayItems(itemsExample);
    createLinks(itemsExample.length);

    // Scroll to the top of the items container
    document.querySelector('.items').scrollIntoView({ behavior: 'smooth' });
  }
}

function handleItemAction(itemId, action) {
  switch (action) {
    case 'add':
      console.log(`Add action for item with ID: ${itemId}`);
      // To do later
      break;
    case 'sub':
      console.log(`Subtract action for item with ID: ${itemId}`);
      // To do later
      break;
    case 'delete':
      console.log(`Delete action for item with ID: ${itemId}`);
      // To do later
      break;
    default:
      console.log(`Unknown action: ${action}`);
  }
}

// Call Functions
displayItems(itemsExample);
createLinks(itemsExample.length);

// Event Listeners

// Target the .items container
itemsContainer.addEventListener('click', function (event) {
  // Check if the clicked element is a button
  if (event.target.tagName === 'BUTTON') {
    // Get the parent item container
    const itemElement = event.target.closest('.item');

    if (itemElement) {
      // Retrieve the item's unique ID
      const itemId = itemElement.getAttribute('data-id');

      // Retrieve the action (add, sub, delete)
      const action = event.target.getAttribute('data-action');

      // Call a function to handle the action
      handleItemAction(itemId, action);
    }
  }
});

// Target coupon
btnApplyCoupon.addEventListener('click', e => {
  const coupon = inputCouponCode.value;
  if (!coupon) {
    console.error("Coupon wasn't entered");
    return;
  }
  inputCouponCode.value = '';
  console.log(coupon);
  if (coupon === 'test') {
    divDiscount.style.display = 'flex';
    // To do later, need coupons object and books object
  }
});

// Target checkout btn
btnCheckout.addEventListener('click', e => {
  console.log('Checked out');
});
