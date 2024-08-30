const data = [
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

  // Children's Books
  { id: "book21", name: "ASTRO CHIMPS", author: "David Williams", category: "Children's Books" },
  { id: "book22", name: "A SPOONFULL OF FROGS", author: "Unknown", category: "Children's Books" },
  { id: "book23", name: "BFF DRAMAS", author: "Katy Kibbie", category: "Children's Books" },
  { id: "book24", name: "I AM TUC", author: "Unknown", category: "Children's Books" },
  { id: "book25", name: "HAROLD LOVES HIS WOOLLY HAT", author: "Vern Kousky", category: "Children's Books" },
  { id: "book26", name: "TAYLOR SWIFT", author: "Maria Isabel", category: "Children's Books" },
  { id: "book27", name: "TRY", author: "Rob Burrow", category: "Children's Books" },
  { id: "book28", name: "THE SECRET SOCIETY", author: "Dan Santat", category: "Children's Books" },
  { id: "book29", name: "FROM MY HEAD TO MY TOES", author: "Bea Jackson", category: "Children's Books" },
  { id: "book30", name: "BUNNY VS MUNKEY", author: "Jamie Smarts", category: "Children's Books" },

  // Coming Soon
  { id: "book31", name: "NEXUS", author: "Yuval Noah Harari", category: "Coming Soon" },
  { id: "book32", name: "A MONSOON RISING", author: "Thea Guanzon", category: "Coming Soon" },
  { id: "book33", name: "WE SOLVE MURDERS", author: "Richard Osman", category: "Coming Soon" },
  { id: "book34", name: "THE WOODSMOKE WOMEN'S BOOK OF SMELLS", author: "Rachel Greenlow", category: "Coming Soon" },
  { id: "book35", name: "THINK AGAIN", author: "Jackline Wilson", category: "Coming Soon" },
  { id: "book36", name: "THE BOY, THE MOLE, THE FOX AND THE HORSE", author: "Charlie Mackesy", category: "Coming Soon" },
  { id: "book37", name: "THE BALLAD OF FALLING DRAGONS", author: "Sarah Parker", category: "Coming Soon" },
  { id: "book38", name: "INTERMEZZO", author: "Sally Rooney", category: "Coming Soon" },
  { id: "book39", name: "IMPOSSIBLE CREATURES", author: "Katherine Rundell", category: "Coming Soon" },
  { id: "book40", name: "THE BELL WITCHES", author: "Lindsey Kelk", category: "Coming Soon" }
];

function displayBooks(books) {
  const resultsList = document.getElementById('resultsList');

  // Clear previous results
  resultsList.innerHTML = '';

  // If no books are found, hide the results list
  if (books.length === 0) {
    resultsList.style.display = 'none'; // Hide results list
    return; // Exit the function early
  }

  // Show results list
  resultsList.style.display = 'block'; // Show results list

  // Display books
  resultsList.innerHTML = books.map(item => `
    <div class='book-item' id='${item.id}'>
      <h3>${item.name}</h3>
      <p>Author: ${item.author}</p>
      <p>Category: ${item.category}</p>
    </div>
  `).join('');
}
document.addEventListener('click', function(event) {
  const searchContainer = document.querySelector('.search-container');
  const searchInput = document.getElementById('searchInput');
  const resultsList = document.getElementById('resultsList');

  // Check if the click was outside the search input or results list
  if (!searchContainer.contains(event.target)) {
    resultsList.style.display = 'none';
  } else {
    resultsList.style.display = 'block';
  }
});// Perform the search and handle click on a search result
function performSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const resultsList = document.getElementById('resultsList');
  const galleryItems = document.querySelectorAll('.gallery-item');

  resultsList.innerHTML = ''; // Clear previous results

  galleryItems.forEach(item => {
    const bookName = item.getAttribute('data-name').toLowerCase();
    const authorName = item.getAttribute('data-author').toLowerCase();

    if (bookName.includes(query) || authorName.includes(query)) {
      const listItem = document.createElement('li');
      listItem.textContent = `${item.getAttribute('data-name')} by ${item.getAttribute('data-author')}`;
      listItem.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the event from bubbling up to the document

        // Remove 'highlight' class from all items
        galleryItems.forEach(i => i.classList.remove('highlight'));

        // Add 'highlight' class to the clicked item
        item.classList.add('highlight');

        item.scrollIntoView({ behavior: 'smooth' });

        resultsList.style.display = 'none'; // Hide results list after clicking
      });
      resultsList.appendChild(listItem);
    }
  });

  if (resultsList.innerHTML === '') {
    resultsList.style.display = 'none'; // Hide results list if no results
  } else {
    resultsList.style.display = 'block'; // Show results list if there are results
  }
}

// Handle click outside to remove the highlight
document.addEventListener('click', function(event) {
  const galleryItems = document.querySelectorAll('.gallery-item');
  let clickedInside = false;

  galleryItems.forEach(item => {
    if (item.contains(event.target)) {
      clickedInside = true;
    }
  });

  if (!clickedInside) {
    galleryItems.forEach(item => {
      item.classList.remove('highlight');
    });
  }
});
