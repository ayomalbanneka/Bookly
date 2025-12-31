window.addEventListener('load', async () => {
    const loadingMessage = [
        "Dusting off our shelves for you...",
        "Flipping through our latest chapters...",
        "Unwrapping your next great read...",
        "Searching our library's hidden gems...",
        "Binding the perfect selection for you...",
        "Turning pages to find your favorites..."
    ]

    const randomLoadingMessage = loadingMessage[Math.floor(Math.random() * loadingMessage.length)];

    Notiflix.Loading.dots(randomLoadingMessage, {
        messageMaxLength: 200,
        clickToClose: false,
        svgColor: "#000cf5"
    });
    try {
        await loadRomanceCategoryBooks();
        await loadMysteryCategoryBooks();
        await loadScienceFictionCategoryBooks();
        await loadFictionCategoryBooks();
        await loadBiographyCategoryBooks();
        await loadBusinessCategoryBooks();
        await loadChildrenCategoryBooks();
        await loadSelfHelpCategoryBooks();
    } catch (e) {
        console.log("Error loading initial data:", e);
    } finally {
        Notiflix.Loading.remove(3000);
    }
})

async function loadRomanceCategoryBooks() {
    try {
        const response = await fetch('api/common/romance');
        if (response.ok) {
            const data = await response.json();

            const romanceBooksContainer = document.getElementById('romanceBooksContainer');
            const romanceBooksCard = document.getElementById('romanceBooksCard');

            // romanceBooksContainer.innerHTML = '';
            console.log(data.romanceBooks.length);
            const bookCount = document.querySelector('#book-count');
            bookCount.innerText = data.romanceBooks.length;


            // Access the romanceBooks array from the response
            data.romanceBooks.forEach((romanceBook) => {
                const bookCard = romanceBooksCard.content.cloneNode(true);

                bookCard.querySelector('#book-link').href = `single-product.html?productId=${romanceBook.productId}`;
                bookCard.querySelector('#book-img').src = romanceBook.images[0];
                bookCard.querySelector('#book-img').alt = romanceBook.title;
                bookCard.querySelector('#book-title').innerHTML = romanceBook.title;
                bookCard.querySelector('#author').innerHTML = romanceBook.author;
                const stock = romanceBook.stockDTOList && romanceBook.stockDTOList.length > 0
                    ? romanceBook.stockDTOList[0].stock
                    : 0;


                // Disable button if out of stock
                const viewBtn = bookCard.querySelector('.view-btn');
                if (stock <= 0) {
                    viewBtn.disabled = true;
                    viewBtn.innerHTML = "Out of Stock";
                }

                // Get the first stock price
                const price = romanceBook.stockDTOList && romanceBook.stockDTOList.length > 0
                    ? romanceBook.stockDTOList[0].price
                    : 0;
                bookCard.querySelector('#price').innerHTML = `LKR ${price.toFixed(2)}`;

                romanceBooksContainer.appendChild(bookCard);
            });
        } else {
            console.error("Failed to load romance books");
        }
    } catch (e) {
        console.error("Error loading romance books:", e);
    }
}

async function loadMysteryCategoryBooks() {
    try {
        const response = await fetch('api/common/mystery')
        if (response.ok) {
            const data = await response.json();
            const fictionBooksContainer = document.getElementById('mysteryBooksContainer');
            const fictionBooksCard = document.getElementById('mysteryBooksCard');

            // fictionBooksContainer.innerHTML = '';

            const bookCount = document.querySelector('#mystery-book-count');
            bookCount.innerText = data.mysteryBooks.length;

            // Access the fictionBooks array from the response
            data.mysteryBooks.forEach((mysteryBook) => {
                const bookCard = fictionBooksCard.content.cloneNode(true);

                bookCard.querySelector('#mystery-book-link').href = `single-product.html?productId=${mysteryBook.productId}`;
                bookCard.querySelector('#mystery-book-img').src = mysteryBook.images[0];
                bookCard.querySelector('#mystery-book-img').alt = mysteryBook.title;
                bookCard.querySelector('#mystery-book-title').innerHTML = mysteryBook.title;
                bookCard.querySelector('#mystery-author').innerHTML = mysteryBook.author;
                const stock = mysteryBook.stockDTOList && mysteryBook.stockDTOList.length > 0
                    ? mysteryBook.stockDTOList[0].stock
                    : 0;

                // Disable button if out of stock
                const viewBtn = bookCard.querySelector('.mystery-view-btn');
                if (stock <= 0) {
                    viewBtn.disabled = true;
                    viewBtn.innerHTML = "Out of Stock";
                }

                // Get the first stock price
                const price = mysteryBook.stockDTOList && mysteryBook.stockDTOList.length > 0
                    ? mysteryBook.stockDTOList[0].price
                    : 0;
                bookCard.querySelector('#mystery-price').innerHTML = `LKR ${price.toFixed(2)}`;

                fictionBooksContainer.appendChild(bookCard);
            });
        } else {
            console.error("Failed to load fiction books");
        }
    } catch (e) {
        console.error("Error loading fiction books:", e);
    }

}

async function loadScienceFictionCategoryBooks() {
    try {
        const response = await fetch('api/common/science-fiction')
        if (response.ok) {
            const data = await response.json();
            const scienceFictionBooksContainer = document.getElementById('scienceFictionBooksContainer');
            const scienceFictionBooksCard = document.getElementById('scienceFictionBooksCard');

            // scienceFictionBooksContainer.innerHTML = '';

            const bookCount = document.querySelector('#science-fiction-book-count');
            bookCount.innerText = data.scienceFictionBooks.length;

            // Access the scienceFictionBooks array from the response
            data.scienceFictionBooks.forEach((scienceFictionBook) => {
                const bookCard = scienceFictionBooksCard.content.cloneNode(true);

                bookCard.querySelector('#science-fiction-book-link').href = `single-product.html?productId=${scienceFictionBook.productId}`;
                bookCard.querySelector('#science-fiction-book-img').src = scienceFictionBook.images[0];
                bookCard.querySelector('#science-fiction-book-img').alt = scienceFictionBook.title;
                bookCard.querySelector('#science-fiction-book-title').innerHTML = scienceFictionBook.title;
                bookCard.querySelector('#science-fiction-author').innerHTML = scienceFictionBook.author;
                const stock = scienceFictionBook.stockDTOList && scienceFictionBook.stockDTOList.length > 0
                    ? scienceFictionBook.stockDTOList[0].stock
                    : 0;

                // Disable button if out of stock
                const viewBtn = bookCard.querySelector('.science-fiction-view-btn');
                if (stock <= 0) {
                    viewBtn.disabled = true;
                    viewBtn.innerHTML = "Out of Stock";
                }

                // Get the first stock price
                const price = scienceFictionBook.stockDTOList && scienceFictionBook.stockDTOList.length > 0
                    ? scienceFictionBook.stockDTOList[0].price
                    : 0;
                bookCard.querySelector('#science-fiction-price').innerHTML = `LKR ${price.toFixed(2)}`;

                scienceFictionBooksContainer.appendChild(bookCard);
            });
        } else {
            console.error("Failed to load science fiction books");
        }
    } catch (e) {
        console.error("Error loading science fiction books:", e);
    }

}

async function loadFictionCategoryBooks() {
    try {
        const response = await fetch('api/common/fiction');
        if (response.ok) {
            const data = await response.json();

            const fictionBooksContainer = document.getElementById('fictionBooksContainer');
            const fictionBooksCard = document.getElementById('fictionBooksCard');

            // fictionBooksContainer.innerHTML = '';

            const bookCount = document.querySelector('#fiction-book-count');
            bookCount.innerText = data.fictionBooks.length;

            // Access the fictionBooks array from the response
            data.fictionBooks.forEach((fictionBook) => {
                const bookCard = fictionBooksCard.content.cloneNode(true);

                bookCard.querySelector('#fiction-book-link').href = `single-product.html?productId=${fictionBook.productId}`;
                bookCard.querySelector('#fiction-book-img').src = fictionBook.images[0];
                bookCard.querySelector('#fiction-book-img').alt = fictionBook.title;
                bookCard.querySelector('#fiction-book-title').innerHTML = fictionBook.title;
                bookCard.querySelector('#fiction-author').innerHTML = fictionBook.author;
                const stock = fictionBook.stockDTOList && fictionBook.stockDTOList.length > 0
                    ? fictionBook.stockDTOList[0].stock
                    : 0;

                // Disable button if out of stock
                const viewBtn = bookCard.querySelector('.fiction-view-btn');
                if (stock <= 0) {
                    viewBtn.disabled = true;
                    viewBtn.innerHTML = "Out of Stock";
                }

                // Get the first stock price
                const price = fictionBook.stockDTOList && fictionBook.stockDTOList.length > 0
                    ? fictionBook.stockDTOList[0].price
                    : 0;
                bookCard.querySelector('#fiction-price').innerHTML = `LKR ${price.toFixed(2)}`;

                fictionBooksContainer.appendChild(bookCard);
            });
        } else {
            console.error("Failed to load fiction books");
        }
    } catch (e) {
        console.error("Error loading fiction books:", e);
    }
}

async function loadBiographyCategoryBooks() {
    try {
        const response = await fetch('api/common/biography');
        if (response.ok) {
            const data = await response.json();

            const biographyBooksContainer = document.getElementById('biographyBooksContainer');
            const biographyBooksCard = document.getElementById('biographyBooksCard');

            // biographyBooksContainer.innerHTML = '';

            const bookCount = document.querySelector('#biography-book-count');
            bookCount.innerText = data.biographyBooks.length;

            // Access the biographyBooks array from the response
            data.biographyBooks.forEach((biographyBook) => {
                const bookCard = biographyBooksCard.content.cloneNode(true);

                bookCard.querySelector('#biography-book-link').href = `single-product.html?productId=${biographyBook.productId}`;
                bookCard.querySelector('#biography-book-img').src = biographyBook.images[0];
                bookCard.querySelector('#biography-book-img').alt = biographyBook.title;
                bookCard.querySelector('#biography-book-title').innerHTML = biographyBook.title;
                bookCard.querySelector('#biography-author').innerHTML = biographyBook.author;

                const stock = biographyBook.stockDTOList && biographyBook.stockDTOList.length > 0
                    ? biographyBook.stockDTOList[0].stock
                    : 0;

                // Disable button if out of stock
                const viewBtn = bookCard.querySelector('.biography-view-btn');
                if (stock <= 0) {
                    viewBtn.disabled = true;
                    viewBtn.innerHTML = "Out of Stock";
                }

                // Get the first stock price
                const price = biographyBook.stockDTOList && biographyBook.stockDTOList.length > 0
                    ? biographyBook.stockDTOList[0].price : 0;

                bookCard.querySelector('#biography-price').innerHTML = `LKR ${price.toFixed(2)}`;

                biographyBooksContainer.appendChild(bookCard);
            });
        }
    } catch (e) {
        console.error("Error loading biography books:", e);
    }
}

async function loadBusinessCategoryBooks() {
    try {
        const response = await fetch('api/common/business');
        if (response.ok) {
            const data = await response.json();

            const businessBooksContainer = document.getElementById('businessBooksContainer');
            const businessBooksCard = document.getElementById('businessBooksCard');

            // businessBooksContainer.innerHTML = '';

            const bookCount = document.querySelector('#business-book-count');
            bookCount.innerText = data.businessBooks.length;

            // Access the businessBooks array from the response
            data.businessBooks.forEach((businessBook) => {
                const bookCard = businessBooksCard.content.cloneNode(true);

                bookCard.querySelector('#business-book-link').href = `single-product.html?productId=${businessBook.productId}`;
                bookCard.querySelector('#business-book-img').src = businessBook.images[0];
                bookCard.querySelector('#business-book-img').alt = businessBook.title;
                bookCard.querySelector('#business-book-title').innerHTML = businessBook.title;
                bookCard.querySelector('#business-author').innerHTML = businessBook.author;

                const stock = businessBook.stockDTOList && businessBook.stockDTOList.length > 0
                    ? businessBook.stockDTOList[0].stock
                    : 0;

                // Disable button if out of stock
                const viewBtn = bookCard.querySelector('.business-view-btn');
                if (stock <= 0) {
                    viewBtn.disabled = true;
                    viewBtn.innerHTML = "Out of Stock";
                }

                // Get the first stock price
                const price = businessBook.stockDTOList && businessBook.stockDTOList.length > 0
                    ? businessBook.stockDTOList[0].price : 0;

                bookCard.querySelector('#business-price').innerHTML = `LKR ${price.toFixed(2)}`;

                businessBooksContainer.appendChild(bookCard);
            });
        }
    } catch (e) {
        console.error("Error loading business books:", e);
    }
}

async function loadChildrenCategoryBooks() {
    try {
        const response = await fetch('api/common/children');
        if (response.ok) {
            const data = await response.json();

            const childrenBooksContainer = document.getElementById('childrenBooksContainer');
            const childrenBooksCard = document.getElementById('childrenBooksCard');

            // childrenBooksContainer.innerHTML = '';

            const bookCount = document.querySelector('#children-book-count');
            bookCount.innerText = data.childrenBooks.length;

            // Access the childrenBooks array from the response
            data.childrenBooks.forEach((childrenBook) => {
                const bookCard = childrenBooksCard.content.cloneNode(true);

                bookCard.querySelector('#children-book-link').href = `single-product.html?productId=${childrenBook.productId}`;
                bookCard.querySelector('#children-book-img').src = childrenBook.images[0];
                bookCard.querySelector('#children-book-img').alt = childrenBook.title;
                bookCard.querySelector('#children-book-title').innerHTML = childrenBook.title;
                bookCard.querySelector('#children-author').innerHTML = childrenBook.author;

                const stock = childrenBook.stockDTOList && childrenBook.stockDTOList.length > 0
                    ? childrenBook.stockDTOList[0].stock
                    : 0;

                // Disable button if out of stock
                const viewBtn = bookCard.querySelector('.children-view-btn');
                if (stock <= 0) {
                    viewBtn.disabled = true;
                    viewBtn.innerHTML = "Out of Stock";
                }

                // Get the first stock price
                const price = childrenBook.stockDTOList && childrenBook.stockDTOList.length > 0
                    ? childrenBook.stockDTOList[0].price : 0;

                bookCard.querySelector('#children-price').innerHTML = `LKR ${price.toFixed(2)}`;

                childrenBooksContainer.appendChild(bookCard);
            });
        }
    } catch (e) {
        console.error("Error loading children books:", e);
    }
}

async function loadSelfHelpCategoryBooks() {
    try {
        const response = await fetch('api/common/self-help');
        if (response.ok) {
            const data = await response.json();

            const selfHelpBooksContainer = document.getElementById('selfHelpBooksContainer');
            const selfHelpBooksCard = document.getElementById('selfHelpBooksCard');

            // selfHelpBooksContainer.innerHTML = '';

            const bookCount = document.querySelector('#self-help-book-count');
            bookCount.innerText = data.selfHelpBooks.length;

            // Access the selfHelpBooks array from the response
            data.selfHelpBooks.forEach((selfHelpBook) => {
                const bookCard = selfHelpBooksCard.content.cloneNode(true);

                bookCard.querySelector('#self-help-book-link').href = `single-product.html?productId=${selfHelpBook.productId}`;
                bookCard.querySelector('#self-help-book-img').src = selfHelpBook.images[0];
                bookCard.querySelector('#self-help-book-img').alt = selfHelpBook.title;
                bookCard.querySelector('#self-help-book-title').innerHTML = selfHelpBook.title;
                bookCard.querySelector('#self-help-author').innerHTML = selfHelpBook.author;

                const stock = selfHelpBook.stockDTOList && selfHelpBook.stockDTOList.length > 0
                    ? selfHelpBook.stockDTOList[0].stock
                    : 0;

                // Disable button if out of stock
                const viewBtn = bookCard.querySelector('.self-help-view-btn');
                if (stock <= 0) {
                    viewBtn.disabled = true;
                    viewBtn.innerHTML = "Out of Stock";
                }

                // Get the first stock price
                const price = selfHelpBook.stockDTOList && selfHelpBook.stockDTOList.length > 0
                    ? selfHelpBook.stockDTOList[0].price : 0;

                bookCard.querySelector('#self-help-price').innerHTML = `LKR ${price.toFixed(2)}`;

                selfHelpBooksContainer.appendChild(bookCard);
            });
        }
    } catch (e) {
        console.error("Error loading self-help books:", e);
    }
}