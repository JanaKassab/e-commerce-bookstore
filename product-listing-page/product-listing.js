document.addEventListener('DOMContentLoaded', function () {
  const checkboxes = document.querySelectorAll(
    '.checkbox-group input[type="checkbox"]'
  );
  const sortSelect = document.getElementById('sort-select');
  const resultCount = document.getElementById('result-count');
  const bookGrid = document.querySelector('.book-grid');
  const selectedCountElement = document.getElementById('selected-count');
  const clearAllButton = document.getElementById('clear-all');
  const selectAllButton = document.getElementById('select-all');
  const gridViewButton = document.getElementById('grid-view-btn');
  const listViewButton = document.getElementById('list-view-btn');

  let bookData = [];

  // Fetch JSON data
  async function fetchBooks() {
    try {
      const response = await fetch('../database/kutubhub_data.json');
      const data = await response.json();
      bookData = data.products;
      generateBookCards(bookData);
      filterBooks();
      sortBooks();
      updateSelectedCount();
    } catch (error) {
      console.error('Error fetching the book data:', error);
    }
  }

  // Generate book cards
  function generateBookCards(books) {
    bookGrid.innerHTML = ''; // Clear previous content
    books.forEach(book => {
      const bookCard = document.createElement('div');
      bookCard.classList.add('book-card');
      bookCard.setAttribute('data-category', book.category);
      bookCard.setAttribute('data-price', book.price);

      bookCard.innerHTML = `
        <img src="${book.images[0]}" alt="${book.title} cover image">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p>${book.description}</p>
        <h2>$${book.price.toFixed(2)}</h2>
      `;
      const addToCartBtn = document.createElement('button');
      addToCartBtn.classList.add('add-to-cart-btn');
      addToCartBtn.textContent = 'Add to Cart';
      addToCartBtn.onclick = () => addToCart(book);

      bookCard.appendChild(addToCartBtn);
      bookGrid.appendChild(bookCard);
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
    let books = JSON.parse(localStorage.getItem('books')) || [];

    // Check if the book already exists in the cart
    let existingBookIndex = books.findIndex(
      b => b.productId === book.productId
    );
    if (existingBookIndex !== -1) {
      books[existingBookIndex].quantity = book.quantity;
    } else {
      books.push(book);
    }

    // Save the updated books array back to localStorage
    localStorage.setItem('books', JSON.stringify(books));

    console.log(books);
  }

  // Filter function
  function filterBooks() {
    let selectedCategories = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    const bookCards = document.querySelectorAll('.book-card');

    bookCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (
        selectedCategories.length === 0 ||
        selectedCategories.includes(cardCategory)
      ) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    updateResultCount();
  }

  // Sort function
  function sortBooks() {
    const selectedOption = sortSelect.value;
    const bookCards = Array.from(document.querySelectorAll('.book-card'));
    const sortedBooks = bookCards.sort((a, b) => {
      const priceA = parseFloat(a.getAttribute('data-price'));
      const priceB = parseFloat(b.getAttribute('data-price'));

      if (selectedOption === 'price-low-to-high') {
        return priceA - priceB;
      } else if (selectedOption === 'price-high-to-low') {
        return priceB - priceA;
      } else {
        return 0; // Default: no sorting for 'Latest'
      }
    });

    sortedBooks.forEach(book => {
      bookGrid.appendChild(book);
    });
  }

  // Update result count
  function updateResultCount() {
    const bookCards = document.querySelectorAll('.book-card');
    const visibleBooks = Array.from(bookCards).filter(
      card => card.style.display !== 'none'
    );
    resultCount.textContent = `${visibleBooks.length} results`;
  }

  // Update selected count
  function updateSelectedCount() {
    const selectedCount = Array.from(checkboxes).filter(
      checkbox => checkbox.checked
    ).length;
    selectedCountElement.textContent = `${selectedCount} selected`;
  }

  // Reset the grid to show all books
  function resetBookGrid() {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
      card.style.display = ''; // Show all books
    });
    updateResultCount();
  }

  // Select all checkboxes
  function selectAllCheckboxes() {
    checkboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
    filterBooks();
    updateSelectedCount();
  }

  // Switch to Grid View
  function switchToGridView() {
    bookGrid.classList.remove('list-view-btn');
    bookGrid.classList.add('grid-view-btn');
    gridViewButton.classList.add('active');
    listViewButton.classList.remove('active');
  }

  // Switch to List View
  function switchToListView() {
    bookGrid.classList.remove('grid-view-btn');
    bookGrid.classList.add('list-view-btn');
    listViewButton.classList.add('active');
    gridViewButton.classList.remove('active');
  }

  // Event listeners
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      filterBooks();
      updateSelectedCount();
    });
  });

  sortSelect.addEventListener('change', sortBooks);

  clearAllButton.addEventListener('click', function () {
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    updateSelectedCount();
    resetBookGrid(); // Reset the grid to show all books
  });

  selectAllButton.addEventListener('click', function () {
    selectAllCheckboxes(); // Select all checkboxes
  });

  gridViewButton.addEventListener('click', switchToGridView);
  listViewButton.addEventListener('click', switchToListView);

  // Initial fetching, sorting, and filtering
  fetchBooks();
});
