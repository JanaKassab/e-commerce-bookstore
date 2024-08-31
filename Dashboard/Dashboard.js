let booksData = []; 
let currentBook = null; // To store the book being edited

document.addEventListener("DOMContentLoaded", function () {
    // Load navigation
    fetch("Navigation.html")
        .then(response => response.text())
        .then(data => {
            const navPlaceholder = document.getElementById("Nav-placeholder");
            if (navPlaceholder) {
                navPlaceholder.innerHTML = data;
            }
        })
        .catch(error => console.error("Error loading navigation:", error));

    // Initialize books data
    let storedData = localStorage.getItem('../database/kutubhub_data');
    if (storedData) {
        booksData = JSON.parse(storedData).products;
    } else {
        fetch('../database/kutubhub_data.json')
            .then(response => response.json())
            .then(data => {
                booksData = data.products;
                saveChangesToJson(booksData); // Store initial data in localStorage
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    initializeBookCards(booksData);

    // Add book form
    const productForm = document.getElementById('ProductForm');
    if (productForm) {
        productForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Get form values
            const title = document.getElementById('Title').value;
            const isbn = document.getElementById('ISBN').value;
            const author = document.getElementById('Author').value;
            const price = parseFloat(document.getElementById('Price').value);
            const category = document.getElementById('Category').value;
            const language = document.getElementById('Languages').value;
            const description = document.getElementById('Description').value;
            const publisher = document.getElementById('Publisher').value;
            const imageFile = document.getElementById('image').files[0]; // File input

            // Check if the book already exists
            const existingBook = booksData.find(book => book.isbn === isbn);

            if (existingBook) {
                alert('A book with this ISBN already exists.');
                return;
            }

            // Read the image if it exists
            if (imageFile) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    const imageUrl = reader.result; // Base64 data URL

                    // Create a new book object
                    const newBook = {
                        title,
                        isbn,
                        author,
                        price,
                        category,
                        language,
                        description,
                        publisher,
                        images: [imageUrl] // Use the Base64 data URL
                    };

                    // Add the new book to booksData and save
                    booksData.push(newBook);
                    saveChangesToJson(booksData);
                    initializeBookCards(booksData);
                    productForm.reset();

                    alert('Book added successfully!');
                };

                reader.readAsDataURL(imageFile); // Read image file as Data URL
            } else {
                // Create a new book object without an image
                const newBook = {
                    title,
                    isbn,
                    author,
                    price,
                    category,
                    language,
                    description,
                    publisher,
                    images: [] // No image
                };

                // Add the new book to booksData and save
                booksData.push(newBook);
                saveChangesToJson(booksData);
                initializeBookCards(booksData);
                productForm.reset();

                alert('Book added successfully!');
            }
        });
    }

    // Handle the update functionality
    const updateBookForm = document.getElementById('updateBookForm');
    if (updateBookForm) {
        updateBookForm.addEventListener('submit', function (event) {
            event.preventDefault();

            if (currentBook) {
                currentBook.title = document.getElementById('bookTitle').value;
                currentBook.author = document.getElementById('bookAuthor').value;
                currentBook.price = parseFloat(document.getElementById('bookPrice').value);
                currentBook.category = document.getElementById('bookCategory').value;

                saveChangesToJson(booksData);

                alert('Book updated successfully!');
                document.getElementById('updateBookModal').style.display = 'none';
                initializeBookCards(booksData);
            }
        });
    }

    // Handle modal close
    const closeModalBtn = document.querySelector('.modal .close-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function () {
            document.getElementById('updateBookModal').style.display = 'none';
        });
    }
});


function initializeBookCards(books) {
    const container = document.getElementById('book-cards-container');
    if (container) {
        container.innerHTML = ''; 

        books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';

            const img = document.createElement('img');
            img.src = book.images[0]; 
            img.alt = book.title; 
            card.appendChild(img);

            const title = document.createElement('h3');
            title.textContent = book.title;
            card.appendChild(title);

            const author = document.createElement('p');
            author.textContent = `Author: ${book.author}`;
            card.appendChild(author);

            const price = document.createElement('p');
            price.textContent = `Price: $${book.price}`;
            card.appendChild(price);

            const category = document.createElement('p');
            category.textContent = `Category: ${book.category}`;
            card.appendChild(category);

            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons';

            const updateButton = document.createElement('button');
            updateButton.className = 'update-btn';
            updateButton.textContent = 'Update';
            updateButton.addEventListener('click', () => openUpdateModal(book));
            buttonsContainer.appendChild(updateButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => handleDelete(book, card));
            buttonsContainer.appendChild(deleteButton);

            card.appendChild(buttonsContainer);

            container.appendChild(card);
        });
    }
}


function openUpdateModal(book) {
    currentBook = book; 


    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookPrice').value = book.price;
    document.getElementById('bookCategory').value = book.category;

    // Show the modal
    document.getElementById('updateBookModal').style.display = 'block';
}

// Function to save changes to JSON using localStorage
function saveChangesToJson(updatedBooksData) {
    const updatedData = JSON.stringify({ products: updatedBooksData });
    localStorage.setItem('../database/kutubhub_data', updatedData);
}

// Handle the delete functionality
function handleDelete(book, cardElement) {
    const confirmation = confirm(`Are you sure you want to delete the book: ${book.title}?`);
    if (confirmation) {
        cardElement.remove();
        const index = booksData.indexOf(book);
        if (index > -1) {
            booksData.splice(index, 1);
        }
        saveChangesToJson(booksData);
        alert(`${book.title} has been deleted.`);
    }
}



