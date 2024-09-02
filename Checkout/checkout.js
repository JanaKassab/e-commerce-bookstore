document.addEventListener('DOMContentLoaded', () => {
  // Handle focus and blur effects on form inputs
  const inputs = document.querySelectorAll(".input");

  function focusFunc() {
    let parent = this.parentNode;
    parent.classList.add("focus");
  }

  function blurFunc() {
    let parent = this.parentNode;
    if (this.value === "") {
      parent.classList.remove("focus");
    }
  }

  inputs.forEach((input) => {
    input.addEventListener("focus", focusFunc);
    input.addEventListener("blur", blurFunc);
  });

  // Store user information in local storage
  function storeUserInfo(loginData) {
    localStorage.setItem('userName', loginData.name);
    localStorage.setItem('userAddress', loginData.address);
    localStorage.setItem('userEmail', loginData.email);
  }

  // Validate checkout information against stored user info
  function validateCheckoutInfo() {
    const userName = localStorage.getItem('userName');
    const userAddress = localStorage.getItem('userAddress');
    const userEmail = localStorage.getItem('userEmail');

    const checkoutName = document.getElementById('name').value;
    const checkoutAddress = document.getElementById('address').value;
    const checkoutEmail = document.getElementById('email').value;

    if (userName !== checkoutName) {
      alert('Full Name does not match.');
      return false;
    }
    if (userAddress !== checkoutAddress) {
      alert('Address does not match.');
      return false;
    }
    if (userEmail !== checkoutEmail) {
      alert('Email does not match.');
      return false;
    }

    return true;
  }

  // Display books from local storage
  const books = JSON.parse(localStorage.getItem('books')) || [];
  const bookListElement = document.getElementById('book-list');
  const totalElement = document.querySelector('.info');

  if (bookListElement) {
    const ul = document.createElement('ul');
    books.forEach((book) => {
      const li = document.createElement('li');
      li.textContent = ` ${book.title}, Quantity: ${book.quantity}`;
      ul.appendChild(li);
    });
    bookListElement.appendChild(ul);
  }

  // Calculate and display total amount
  function updateTotalAmount() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const totalAmount = books.reduce((total, book) => total + (book.price * book.quantity), 0);
    if (totalElement) {
      totalElement.textContent = `Total: $${totalAmount.toFixed(2)}`;
    }
  }
  updateTotalAmount();

  // Handle payment method toggle
  function togglePaymentMethod() {
    const paymentMethod = document.getElementById('payment-method').value;
    const cardDetails = document.getElementById('card-details');
    const codDetails = document.getElementById('cod-details');

    if (paymentMethod === 'card') {
      cardDetails.style.display = 'block';
      codDetails.style.display = 'none';
      document.getElementById('card-number').required = true;
      document.getElementById('expiry-date').required = true;
      document.getElementById('cvv').required = true;
    } else if (paymentMethod === 'cod') {
      cardDetails.style.display = 'none';
      codDetails.style.display = 'block';
      document.getElementById('card-number').required = false;
      document.getElementById('expiry-date').required = false;
      document.getElementById('cvv').required = false;
    }
  }

  document.getElementById('payment-method').addEventListener('change', togglePaymentMethod);

  // Handle form submission
  document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();

    if (validateCheckoutInfo()) {
      // Store checkout details in local storage
      const checkoutDetails = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zipCode: document.getElementById('zip-code').value,
        region: document.getElementById('region').value,
        paymentMethod: document.getElementById('payment-method').value,
        cardNumber: document.getElementById('card-number').value,
        expiryDate: document.getElementById('expiry-date').value,
        cvv: document.getElementById('cvv').value,
      };

      localStorage.setItem('checkoutDetails', JSON.stringify(checkoutDetails));
      localStorage.removeItem('books'); // Clear books from local storage after successful order

      alert('Order has been placed successfully!');
      window.location.href = 'thank-you.html'; // Redirect to a thank you page
    }
  });

  // Go back function
  function goBack() {
    window.history.back();
  }

  // Function to remove a book item from the list and local storage
  function removeItem(button) {
    const listItem = button.closest('.book-item');
    if (listItem) {
      const bookTitle = listItem.querySelector('.book-title').textContent.trim();
      let books = JSON.parse(localStorage.getItem('books')) || [];
      books = books.filter(book => book.title !== bookTitle);
      localStorage.setItem('books', JSON.stringify(books));
      listItem.remove();
      updateTotalAmount();
    }
  }

  // Attach goBack function to the back button
  document.querySelector('.back-btn').addEventListener('click', goBack);
});
console.log('Stored User Info:', {
  name: localStorage.getItem('userName'),
  address: localStorage.getItem('userAddress'),
  email: localStorage.getItem('userEmail'),
});

console.log('Books:', JSON.parse(localStorage.getItem('books')));
