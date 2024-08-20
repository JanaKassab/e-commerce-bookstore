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

// Make discount initially display none
divDiscount.style.display = 'none';
// Functions
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
