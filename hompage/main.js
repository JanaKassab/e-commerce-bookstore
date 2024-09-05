


const MyBookApp = {
  data: [
    // Bestsellers
    { id: "book1", name: "WATCH ME", author: "Tahereh Mafi", category: "Fiction" },
    { id: "book2", name: "WISTERIA", author: "Adalyn Grace", category: "Romance" },
    { id: "book3", name: "GOOD ENERGY", author: "Casey Means", category: "Self-Help" },
    { id: "book4", name: "THE NEW COUPLE IN 58", author: "Lisa Unger", category: "Thriller" },
    { id: "book5", name: "THE MIRROR", author: "Nora Roberts", category: "Mystery" },
    { id: "book6", name: "THE BOOK OF BILL", author: "Unknown", category: "Biography" },
    { id: "book7", name: "THE STRIKER", author: "Ana Huang", category: "Romance" },
    { id: "book8", name: "IT ENDS WITH US", author: "Colleen Hoover", category: "Contemporary" },
    { id: "book9", name: "THE WREN IN THE HOLY LIBRARY", author: "K.A. Linde", category: "Fantasy" },
    { id: "book10", name: "ONYX STORM", author: "Rebecca Yarros", category: "Romantic Suspense" },
    // Trending
    { id: "book11", name: "THE HAMMER OF EDEN", author: "Ken Follett", category: "Thriller" },
    { id: "book12", name: "BLUE BLOODED", author: "Emma Jameson", category: "Mystery" },
    { id: "book13", name: "THE BOOK THIEF", author: "Markus Zusak", category: "Historical Fiction" },
    { id: "book14", name: "STEVE JOBS", author: "Walter Isaacson", category: "Biography" },
    { id: "book15", name: "GONE GIRL", author: "Gillian Flynn", category: "Thriller" },
    { id: "book16", name: "THE GREAT GATSBY", author: "F. Scott Fitzgerald", category: "Classic" },
    { id: "book17", name: "THE DAVINCI CODE", author: "Dan Brown", category: "Mystery" },
    { id: "book18", name: "THE SILENT PATIENT", author: "Alex Michaelides", category: "Psychological Thriller" },
    { id: "book19", name: "LESSONS IN CHEMISTRY", author: "Bonnie Garmus", category: "Historical Fiction" },
    { id: "book20", name: "FOURTH WING", author: "Rebecca Yarros", category: "Fantasy" },
    // Other sections omitted for brevity...
  ],

  init: function() {
    this.bindSearch();
    this.handleClickOutside();
  },

  displayBooks: function(books) {
    const resultsList = document.getElementById('resultsList');
    if (!resultsList) return; // Exit if the resultsList doesn't exist

    // Clear previous results
    resultsList.innerHTML = '';

    // Hide results list if no books found
    if (books.length === 0) {
      resultsList.style.display = 'none';
      return;
    }

    // Show and display books
    resultsList.style.display = 'block';
    resultsList.innerHTML = books.map(item => `
      <div class='book-item' id='${item.id}'>
        <h3>${item.name}</h3>
        <p>Author: ${item.author}</p>
        <p>Category: ${item.category}</p>
      </div>
    `).join('');
  },

  performSearch: function() {
    const searchInput = document.getElementById('searchInput');
    const resultsList = document.getElementById('resultsList');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!searchInput || !resultsList || galleryItems.length === 0) return; // Exit if elements don't exist

    const query = searchInput.value.toLowerCase();
    resultsList.innerHTML = ''; // Clear previous results

    galleryItems.forEach(item => {
      const bookName = item.getAttribute('data-name').toLowerCase();
      const authorName = item.getAttribute('data-author').toLowerCase();

      if (bookName.includes(query) || authorName.includes(query)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.getAttribute('data-name')} by ${item.getAttribute('data-author')}`;
        listItem.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent event bubbling

          // Remove 'highlight' from all items
          galleryItems.forEach(i => i.classList.remove('highlight'));

          // Add 'highlight' to the clicked item
          item.classList.add('highlight');

          // Scroll into view
          item.scrollIntoView({ behavior: 'smooth' });

          // Hide results list after clicking
          resultsList.style.display = 'none';
        });
        resultsList.appendChild(listItem);
      }
    });

    // Show or hide results based on found items
    resultsList.style.display = resultsList.innerHTML === '' ? 'none' : 'block';
  },

  handleClickOutside: function() {
    document.addEventListener('click', function(event) {
      const searchContainer = document.querySelector('.search-container');
      const searchInput = document.getElementById('searchInput');
      const resultsList = document.getElementById('resultsList');
      const galleryItems = document.querySelectorAll('.gallery-item');

      if (!searchContainer || !resultsList || galleryItems.length === 0) return;

      // Hide results if clicking outside search container
      if (!searchContainer.contains(event.target)) {
        resultsList.style.display = 'none';
      }

      // Remove highlight if clicking outside the gallery items
      let clickedInside = false;
      galleryItems.forEach(item => {
        if (item.contains(event.target)) {
          clickedInside = true;
        }
      });

      if (!clickedInside) {
        galleryItems.forEach(item => item.classList.remove('highlight'));
      }
    });
  },

  bindSearch: function() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return; // Exit if searchInput doesn't exist

    searchInput.addEventListener('input', () => {
      this.performSearch();
    });
  }
};

// Initialize the app after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  MyBookApp.init();
});
