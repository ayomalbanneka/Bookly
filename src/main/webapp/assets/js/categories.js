const CATEGORY_PAGE_CONFIGS = [
    {
        key: 'romance',
        endpoint: 'api/common/romance',
        responseKey: 'romanceBooks',
        containerId: 'romanceBooksContainer',
        templateId: 'romanceBooksCard',
        countId: 'book-count',
        selectors: {
            link: '#book-link',
            image: '#book-img',
            title: '#book-title',
            author: '#author',
            price: '#price',
            viewButton: '.view-btn',
            bestsellerBadge: '#bestsellersBadge'
        }
    },
    {
        key: 'mystery',
        endpoint: 'api/common/mystery',
        responseKey: 'mysteryBooks',
        containerId: 'mysteryBooksContainer',
        templateId: 'mysteryBooksCard',
        countId: 'mystery-book-count',
        selectors: {
            link: '#mystery-book-link',
            image: '#mystery-book-img',
            title: '#mystery-book-title',
            author: '#mystery-author',
            price: '#mystery-price',
            viewButton: '.mystery-view-btn',
            bestsellerBadge: '#mysteryBestsellersBadge'
        }
    },
    {
        key: 'fiction',
        endpoint: 'api/common/fiction',
        responseKey: 'fictionBooks',
        containerId: 'fictionBooksContainer',
        templateId: 'fictionBooksCard',
        countId: 'fiction-book-count',
        selectors: {
            link: '#fiction-book-link',
            image: '#fiction-book-img',
            title: '#fiction-book-title',
            author: '#fiction-author',
            price: '#fiction-price',
            viewButton: '.fiction-view-btn',
            bestsellerBadge: '#fictionBestsellersBadge'
        }
    },
    {
        key: 'science-fiction',
        endpoint: 'api/common/science-fiction',
        responseKey: 'scienceFictionBooks',
        containerId: 'scienceFictionBooksContainer',
        templateId: 'scienceFictionBooksCard',
        countId: 'science-fiction-book-count',
        selectors: {
            link: '#science-fiction-book-link',
            image: '#science-fiction-book-img',
            title: '#science-fiction-book-title',
            author: '#science-fiction-author',
            price: '#science-fiction-price',
            viewButton: '.science-fiction-view-btn',
            bestsellerBadge: '#scifiBestsellersBadge'
        }
    },
    {
        key: 'biography',
        endpoint: 'api/common/biography',
        responseKey: 'biographyBooks',
        containerId: 'biographyBooksContainer',
        templateId: 'biographyBooksCard',
        countId: 'biography-book-count',
        selectors: {
            link: '#biography-book-link',
            image: '#biography-book-img',
            title: '#biography-book-title',
            author: '#biography-author',
            price: '#biography-price',
            viewButton: '.biography-view-btn',
            bestsellerBadge: '#biographyBestsellersBadge'
        }
    },
    {
        key: 'business',
        endpoint: 'api/common/business',
        responseKey: 'businessBooks',
        containerId: 'businessBooksContainer',
        templateId: 'businessBooksCard',
        countId: 'business-book-count',
        selectors: {
            link: '#business-book-link',
            image: '#business-book-img',
            title: '#business-book-title',
            author: '#business-author',
            price: '#business-price',
            viewButton: '.business-view-btn',
            bestsellerBadge: '#businessBestsellersBadge'
        }
    },
    {
        key: 'children',
        endpoint: 'api/common/children',
        responseKey: 'childrenBooks',
        containerId: 'childrenBooksContainer',
        templateId: 'childrenBooksCard',
        countId: 'children-book-count',
        selectors: {
            link: '#children-book-link',
            image: '#children-book-img',
            title: '#children-book-title',
            author: '#children-author',
            price: '#children-price',
            viewButton: '.children-view-btn',
            bestsellerBadge: '#childrenBestsellersBadge'
        }
    },
    {
        key: 'self-help',
        endpoint: 'api/common/self-help',
        responseKey: 'selfHelpBooks',
        containerId: 'selfHelpBooksContainer',
        templateId: 'selfHelpBooksCard',
        countId: 'self-help-book-count',
        selectors: {
            link: '#self-help-book-link',
            image: '#self-help-book-img',
            title: '#self-help-book-title',
            author: '#self-help-author',
            price: '#self-help-price',
            viewButton: '.self-help-view-btn',
            bestsellerBadge: '#selfhelpBestsellersBadge'
        }
    }
];

let activeCategoryState = null;

window.addEventListener('load', async () => {
    const pageConfigs = CATEGORY_PAGE_CONFIGS.filter(config => document.getElementById(config.containerId));
    if (!pageConfigs.length) {
        return;
    }

    const loadingMessage = [
        "Dusting off our shelves for you...",
        "Flipping through our latest chapters...",
        "Unwrapping your next great read...",
        "Searching our library's hidden gems...",
        "Binding the perfect selection for you...",
        "Turning pages to find your favorites..."
    ];

    const randomLoadingMessage = loadingMessage[Math.floor(Math.random() * loadingMessage.length)];

    Notiflix.Loading.dots(randomLoadingMessage, {
        messageMaxLength: 200,
        clickToClose: false,
        svgColor: "#000cf5"
    });

    try {
        for (const config of pageConfigs) {
            await loadCategoryPage(config);
        }
    } catch (e) {
        console.log("Error loading initial data:", e);
    } finally {
        Notiflix.Loading.remove(3000);
    }
});

async function loadCategoryPage(config) {
    try {
        const response = await fetch(config.endpoint);
        if (!response.ok) {
            console.error(`Failed to load ${config.key} books`);
            return;
        }

        const data = await response.json();
        const items = Array.isArray(data[config.responseKey]) ? data[config.responseKey] : [];
        const normalizedItems = items.map((item, index) => normalizeCategoryItem(item, index));

        const state = createCategoryState(config, normalizedItems);
        activeCategoryState = state;

        setupCategoryControls(state);
        applyFiltersAndRender(state, true);
    } catch (e) {
        console.error(`Error loading ${config.key} books:`, e);
    }
}

function normalizeCategoryItem(item, index) {
    const stock = item.stockDTOList && item.stockDTOList.length > 0 ? item.stockDTOList[0] : {};
    const price = Number(stock.price || 0);
    const stockQty = Number(stock.stock || 0);
    const images = Array.isArray(item.images) ? item.images : [];

    return {
        raw: item,
        index: index,
        productId: item.productId,
        title: item.title || '',
        author: item.author || '',
        image: images[0] || '',
        price: Number.isFinite(price) ? price : 0,
        stock: Number.isFinite(stockQty) ? stockQty : 0,
        bestSeller: isBestSeller(item)
    };
}

function isBestSeller(item) {
    return Boolean(item.bestSeller || item.bestseller || item.isBestSeller || item.isBestSellerBook);
}

function createCategoryState(config, items) {
    const priceRange = getPriceRange(items);
    const state = {
        config,
        allItems: items,
        filteredItems: [],
        currentPage: 1,
        itemsPerPage: 9,
        sortBy: 'popularity',
        priceRange,
        maxPrice: priceRange.max
    };

    updatePriceRangeUI(state);
    return state;
}

function setupCategoryControls(state) {
    const sortOptions = document.querySelectorAll('.category-sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            event.preventDefault();
            state.sortBy = option.dataset.sort || 'popularity';
            updateSortLabel(option.textContent.trim());
            applyFiltersAndRender(state, true);
        });
    });

    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', () => {
            updatePriceLabels(state, Number(priceRange.value));
            applyFiltersAndRender(state, true);
        });
    }

    const bestsellerToggle = document.getElementById('bestsellersOnly');
    if (bestsellerToggle) {
        bestsellerToggle.addEventListener('change', () => applyFiltersAndRender(state, true));
    }

    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => applyFiltersAndRender(state, true));
    }
}

function updateSortLabel(label) {
    const sortLabel = document.getElementById('categorySortLabel');
    if (sortLabel) {
        sortLabel.textContent = label || 'Most Popular';
    }
}

function updatePriceRangeUI(state) {
    const priceRange = document.getElementById('priceRange');
    if (!priceRange) {
        return;
    }

    priceRange.min = state.priceRange.min;
    priceRange.max = state.priceRange.max;
    priceRange.value = state.priceRange.max;
    updatePriceLabels(state, state.priceRange.max);
}

function updatePriceLabels(state, maxPrice) {
    const minLabel = document.getElementById('priceMinLabel');
    const maxLabel = document.getElementById('priceMaxLabel');
    const selectedLabel = document.getElementById('priceSelectedLabel');

    if (minLabel) {
        minLabel.textContent = formatLkr(state.priceRange.min);
    }
    if (maxLabel) {
        maxLabel.textContent = formatLkr(state.priceRange.max);
    }
    if (selectedLabel) {
        selectedLabel.textContent = `Selected: ${formatLkr(state.priceRange.min)} - ${formatLkr(maxPrice)}`;
    }
}

function applyFiltersAndRender(state, resetPage) {
    const maxPrice = getSelectedMaxPrice(state);
    const bestsellerToggle = document.getElementById('bestsellersOnly');
    const bestsellersOnly = bestsellerToggle ? bestsellerToggle.checked : false;

    const filtered = state.allItems.filter(item => {
        const priceMatch = item.price >= state.priceRange.min && item.price <= maxPrice;
        const bestSellerMatch = !bestsellersOnly || item.bestSeller;
        return priceMatch && bestSellerMatch;
    });

    state.filteredItems = sortCategoryItems(filtered, state.sortBy);
    if (resetPage) {
        state.currentPage = 1;
    }

    renderCategoryPage(state);
}

function getSelectedMaxPrice(state) {
    const priceRange = document.getElementById('priceRange');
    const maxPrice = priceRange ? Number(priceRange.value) : state.priceRange.max;
    return Number.isFinite(maxPrice) ? maxPrice : state.priceRange.max;
}

function sortCategoryItems(items, sortBy) {
    const itemsCopy = items.slice();
    switch (sortBy) {
        case 'newest':
            return itemsCopy.sort((a, b) => Number(b.productId || 0) - Number(a.productId || 0));
        case 'price-low':
            return itemsCopy.sort((a, b) => a.price - b.price);
        case 'price-high':
            return itemsCopy.sort((a, b) => b.price - a.price);
        case 'best-sellers':
            return itemsCopy.sort((a, b) => {
                if (a.bestSeller === b.bestSeller) {
                    return a.index - b.index;
                }
                return a.bestSeller ? -1 : 1;
            });
        case 'title':
            return itemsCopy.sort((a, b) => a.title.localeCompare(b.title));
        case 'popularity':
        default:
            return itemsCopy.sort((a, b) => a.index - b.index);
    }
}

function renderCategoryPage(state) {
    const container = document.getElementById(state.config.containerId);
    const template = document.getElementById(state.config.templateId);

    if (!container || !template) {
        return;
    }

    const totalItems = state.filteredItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / state.itemsPerPage));
    if (state.currentPage > totalPages) {
        state.currentPage = totalPages;
    }

    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = Math.min(startIndex + state.itemsPerPage, totalItems);
    const pageItems = state.filteredItems.slice(startIndex, endIndex);

    container.innerHTML = '';

    if (!pageItems.length) {
        container.innerHTML = '<div class="col-12 text-center text-muted py-5">No books found for the selected filters.</div>';
    } else {
        pageItems.forEach((item) => {
            const card = template.content.cloneNode(true);
            populateCard(card, state.config.selectors, item);
            container.appendChild(card);
        });
    }

    updateCategoryCounts(state, startIndex, endIndex);
    updateCategoryPagination(state, totalPages);
}

function populateCard(card, selectors, item) {
    const linkEl = card.querySelector(selectors.link);
    if (linkEl) {
        linkEl.href = `single-product.html?productId=${item.productId}`;
    }

    const imageEl = card.querySelector(selectors.image);
    if (imageEl) {
        imageEl.src = item.image;
        imageEl.alt = item.title || 'Book Cover';
    }

    const titleEl = card.querySelector(selectors.title);
    if (titleEl) {
        titleEl.textContent = item.title;
    }

    const authorEl = card.querySelector(selectors.author);
    if (authorEl) {
        authorEl.textContent = item.author;
    }

    const priceEl = card.querySelector(selectors.price);
    if (priceEl) {
        priceEl.textContent = formatLkr(item.price);
    }

    const viewButton = card.querySelector(selectors.viewButton);
    if (viewButton && item.stock <= 0) {
        viewButton.disabled = true;
        viewButton.textContent = 'Out of Stock';
    }

    const badge = card.querySelector(selectors.bestsellerBadge);
    if (badge) {
        if (item.bestSeller) {
            badge.classList.remove('d-none');
        } else {
            badge.classList.add('d-none');
        }
    }
}

function updateCategoryCounts(state, startIndex, endIndex) {
    const countEl = document.getElementById(state.config.countId);
    const showingCountEl = document.getElementById('categoryShowingCount');
    const totalCountEl = document.getElementById('categoryTotalCount');

    if (countEl) {
        countEl.textContent = state.filteredItems.length;
    }

    if (showingCountEl) {
        showingCountEl.textContent = state.filteredItems.length ? `${startIndex + 1}-${endIndex}` : '0';
    }

    if (totalCountEl) {
        totalCountEl.textContent = state.filteredItems.length;
    }
}

function updateCategoryPagination(state, totalPages) {
    const paginationContainer = document.getElementById('categoryPagination');
    const pageInfo = document.getElementById('categoryPageInfo');

    if (!paginationContainer) {
        return;
    }

    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        if (pageInfo) {
            pageInfo.textContent = '';
        }
        return;
    }

    paginationContainer.style.display = 'block';

    let paginationHTML = '<ul class="pagination justify-content-center">';

    paginationHTML += `
        <li class="page-item ${state.currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeCategoryPage(${state.currentPage - 1}); return false;" tabindex="-1">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeCategoryPage(1); return false;">1</a>
            </li>
        `;
        if (startPage > 2) {
            paginationHTML += `
                <li class="page-item disabled">
                    <a class="page-link" href="#">...</a>
                </li>
            `;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === state.currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changeCategoryPage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `
                <li class="page-item disabled">
                    <a class="page-link" href="#">...</a>
                </li>
            `;
        }
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeCategoryPage(${totalPages}); return false;">${totalPages}</a>
            </li>
        `;
    }

    paginationHTML += `
        <li class="page-item ${state.currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeCategoryPage(${state.currentPage + 1}); return false;">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;

    paginationHTML += '</ul>';
    paginationContainer.innerHTML = paginationHTML;

    if (pageInfo) {
        pageInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;
    }
}

function getPriceRange(items) {
    if (!items.length) {
        return { min: 0, max: 0 };
    }

    let minPrice = Infinity;
    let maxPrice = 0;

    items.forEach(item => {
        if (item.price < minPrice) {
            minPrice = item.price;
        }
        if (item.price > maxPrice) {
            maxPrice = item.price;
        }
    });

    if (!Number.isFinite(minPrice)) {
        minPrice = 0;
    }

    return {
        min: Math.floor(minPrice),
        max: Math.ceil(maxPrice)
    };
}

function formatLkr(value) {
    const amount = Number.isFinite(value) ? value : 0;
    return `LKR ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(amount)}`;
}

function changeCategoryPage(page) {
    if (!activeCategoryState) {
        return;
    }

    const totalPages = Math.max(1, Math.ceil(activeCategoryState.filteredItems.length / activeCategoryState.itemsPerPage));
    if (page < 1 || page > totalPages) {
        return;
    }

    activeCategoryState.currentPage = page;
    renderCategoryPage(activeCategoryState);
}

window.changeCategoryPage = changeCategoryPage;
