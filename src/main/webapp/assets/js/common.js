window.addEventListener('load', async () => {
    Notiflix.Loading.dots("Data is Loading...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });
    try {
        // Only run on my-account.html
        if (window.location.pathname.includes('my-account.html')) {
            await loadDistricts();
            const districtSelect = document.getElementById('districtSelect');
            districtSelect.addEventListener('change', loadCities);
        }

        if (window.location.pathname.includes('cart.html')) {
            await loadCartItems();
        }

        if (window.location.pathname.includes('shop.html')) {
            initFilterToggle();
            await loadAdvancedSearchData();
        }


    } catch (e) {
        console.log("Error loading initial data:", e);
    } finally {
        Notiflix.Loading.remove(3000);
    }
})

// Add event listener for sort options
document.addEventListener('DOMContentLoaded', function () {
    const sortOptions = document.querySelectorAll('.sort-option');

    sortOptions.forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            const sortValue = this.getAttribute('data-sort');
            // Update the displayed sort option
            document.getElementById('currentSort').textContent = this.textContent.trim();

            // Call the sort function
            sortProducts(sortValue);
        });
    });
});

function initFilterToggle() {
    const toggleFiltersBtn = document.getElementById('toggleFilters');
    const filtersSidebar = document.getElementById('filtersSidebar');
    const filtersOverlay = document.createElement('div');

    if (!toggleFiltersBtn || !filtersSidebar) {
        console.error('Filter elements not found');
        return;
    }

    // Create overlay for mobile
    filtersOverlay.className = 'filters-overlay';
    document.body.appendChild(filtersOverlay);

    // Toggle filters on button click
    toggleFiltersBtn.addEventListener('click', function () {
        filtersSidebar.classList.toggle('show');
        filtersOverlay.classList.toggle('show');

        // Update button text
        if (filtersSidebar.classList.contains('show')) {
            toggleFiltersBtn.innerHTML = '<i class="bi bi-x-circle me-1"></i> Hide Filters';
            toggleFiltersBtn.classList.remove('btn-outline-primary');
            toggleFiltersBtn.classList.add('btn-primary');
        } else {
            toggleFiltersBtn.innerHTML = '<i class="bi bi-funnel me-1"></i> Show Filters';
            toggleFiltersBtn.classList.remove('btn-primary');
            toggleFiltersBtn.classList.add('btn-outline-primary');
        }
    });

    // Close filters when clicking overlay
    filtersOverlay.addEventListener('click', function () {
        filtersSidebar.classList.remove('show');
        filtersOverlay.classList.remove('show');
        toggleFiltersBtn.innerHTML = '<i class="bi bi-funnel me-1"></i> Show Filters';
        toggleFiltersBtn.classList.remove('btn-primary');
        toggleFiltersBtn.classList.add('btn-outline-primary');
    });

    // Close filters on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && filtersSidebar.classList.contains('show')) {
            filtersSidebar.classList.remove('show');
            filtersOverlay.classList.remove('show');
            toggleFiltersBtn.innerHTML = '<i class="bi bi-funnel me-1"></i> Show Filters';
            toggleFiltersBtn.classList.remove('btn-primary');
            toggleFiltersBtn.classList.add('btn-outline-primary');
        }
    });
}

// Search functionality
const searchModal = document.getElementById('searchModal');
if (searchModal) {
    const searchForm = searchModal.querySelector('form');
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const searchInput = this.querySelector('input[type="text"]');
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
            // Close modal
            const modal = bootstrap.Modal.getInstance(searchModal);
            modal.hide();

            // Show search results notification
            showNotification(`Searching for: "${searchTerm}"`, 'info');

            // In a real application, you would redirect to search results page
            // window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });
}

// Mobile menu enhancement
const navbarToggler = document.querySelector('.navbar-toggler');
if (navbarToggler) {
    navbarToggler.addEventListener('click', function () {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        navbarCollapse.classList.toggle('show');
    });
}

// Category cards hover effect
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Load cities based on selected district
async function loadCities() {
    const districtSelect = document.getElementById('districtSelect');
    const selectedDistrictId = districtSelect.value;

    console.log("Selected District ID:", selectedDistrictId);

    // Don't load cities if no district is selected
    if (selectedDistrictId === "0" || !selectedDistrictId) {
        const citySelect = document.getElementById('citySelect');
        citySelect.innerHTML = '<option value="0">Select City</option>';
        return;
    }

    Notiflix.Loading.dots("Loading Cities...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });

    try {
        const response = await fetch(`api/data/${selectedDistrictId}/cities`, {
            method: 'GET',
            credentials: 'include'
        })

        if (response.ok) {
            const data = await response.json();
            console.log("Cities data:", data);

            const citySelect = document.getElementById('citySelect');

            if (data.status) {
                renderDropDowns(citySelect, data.cities, 'name');
            } else {
                new Notify({
                    status: 'error',
                    title: 'Error',
                    text: data.message,
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    notificationsGap: null,
                    notificationsPadding: null,
                    type: 'outline',
                    position: 'right top',
                })
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to load cities',
                effect: 'fade',
                speed: 300,
                showIcon: true,
                showCloseButton: true,
                autoclose: true,
                autotimeout: 3000,
                notificationsGap: null,
                notificationsPadding: null,
                type: 'outline',
                position: 'right top',
            })
        }
    } catch (e) {
        console.error("Error loading cities:", e);
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            notificationsGap: null,
            notificationsPadding: null,
            type: 'outline',
            position: 'right top',
        })
    } finally {
        Notiflix.Loading.remove(1000);
    }
}

// Load districts for the dropdown
async function loadDistricts() {
    try {
        const response = await fetch(`api/data/districts`, {
            method: 'GET',
            credentials: 'include'
        })

        if (response.ok) {
            const data = await response.json();

            const districtSelect = document.getElementById('districtSelect');

            if (data.districts && data.districts.length > 0) {
                renderDropDowns(districtSelect, data.districts, 'name');
            }
        }
    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            notificationsGap: null,
            notificationsPadding: null,
            type: 'outline',
            position: 'right top',
        })
    }
}

// Utility function to render dropdown options
function renderDropDowns(selector, list, suffix) {
    selector.innerHTML = `<option value="0">Select</option>`; // Clear existing options first!
    list.forEach((item) => {
        const option = document.createElement("option"); // Create a new option element
        option.value = item.id;
        option.innerHTML = item[suffix]; // Set the display text
        selector.appendChild(option); // Append the option to the select element
    })
}

// Add to cart functionality
async function addToCart(stockId, qty) {
    try {
        Notiflix.Loading.dots('Adding to cart...', {
            clickToClose: false,
            svgColor: '#000cf5'
        });

        const response = await fetch(`api/common/add-to-cart?sId=${stockId}&qty=${qty}`);

        if (response.ok) {
            let data = await response.json();
            if (data.status) {
                new Notify({
                    status: 'success',
                    title: 'Success',
                    text: data.message,
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    notificationsGap: null,
                    notificationsPadding: null,
                    type: 'outline',
                    position: 'right top',
                })
            } else {
                new Notify({
                    status: 'error',
                    title: 'Error',
                    text: data.message,
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    notificationsGap: null,
                    notificationsPadding: null,
                    type: 'outline',
                    position: 'right top',
                })
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to add to cart. Please try again.',
                effect: 'fade',
                speed: 300,
                showIcon: true,
                showCloseButton: true,
                autoclose: true,
                autotimeout: 3000,
                notificationsGap: null,
                notificationsPadding: null,
                type: 'outline',
                position: 'right top',
            })
        }
    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            notificationsGap: null,
            notificationsPadding: null,
            type: 'outline',
            position: 'right top',
        })
    } finally {
        Notiflix.Loading.remove();
    }
}

// Load cart items
async function loadCartItems() {
    try {
        Notiflix.Loading.dots('Loading cart items...', {
            clickToClose: false,
            svgColor: '#000cf5'
        });

        const response = await fetch('api/common/get-cart-items');
        if (response.ok) {
            let data = await response.json();

            const cartItemsContainer = document.getElementById('cartItemsContainer');
            const orderSummary = document.getElementById('orderSummary');
            const emptyCartDesign = document.getElementById('emptyCart');

            if (data.cartItems == null) {
                emptyCartDesign.classList.remove('d-none');
                cartItemsContainer.style.display = 'none';
                orderSummary.style.display = 'none';
            } else {
                emptyCartDesign.classList.add('d-none');
                cartItemsContainer.style.display = 'block';
                orderSummary.style.display = 'block';
            }

            if (data.status) {
                console.log(data);

                if (cartItemsContainer) {
                    cartItemsContainer.innerHTML = '';

                    let subtotal = 0;
                    let totalQty = 0;
                    let totalShipping = 0;
                    const deliveryTypeList = data.deliveryTypeList;

                    // Calculate shipping cost per product (each product gets one shipping charge)
                    const shippingPerProduct = deliveryTypeList.length > 0 ? deliveryTypeList[0].price : 0;
                    totalShipping = data.cartItems.length * shippingPerProduct;

                    data.cartItems.forEach((item) => {
                        let itemsTotal = parseFloat(item.price) * parseInt(item.qty);
                        subtotal += itemsTotal;
                        totalQty += parseInt(item.qty);

                        cartItemsContainer.innerHTML += `
                            <div class="cart-item" data-item-id="1" id="cartItems">
                        <div class="cart-item-content">
                            <div class="row g-3 align-items-center">

                                <!-- Book Image -->
                                <div class="col-4 col-sm-3 col-md-2">
                                    <div class="book-thumbnail">
                                        <img src="${item.images[0]}"
                                             alt="The Great Gatsby"
                                             class="${item.productTitle}">
                                    </div>
                                </div>

                                <!-- Book Details -->
                                <div class="col-8 col-sm-9 col-md-5">
                                    <h5 class="book-title mb-1">${item.productTitle}</h5>
                                    <p class="book-author text-muted mb-2">${item.authorName}</p>
                                    <div class="book-meta d-flex flex-wrap gap-2 mb-2">
                                        <span class="meta-badge">${item.bookCategory}</span>
                                        <span class="meta-badge">${item.pages} Pages</span>
                                    </div>
                                    <div class="mobile-price d-md-none">
                                        <span class="current-price">LKR 
                                        ${new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(item.price)}</span>
                                    </div>
                                </div>

                                <!-- Quantity & Price -->
                                <div class="col-12 col-md-5">
                                    <div class="row align-items-center g-2">

                                        <!-- Quantity Selector -->
                                        <div class="col-6 col-md-4">
                                            <div class="quantity-control">
                                                <button class="qty-btn qty-minus" data-item="1">
                                                    <i class="bi bi-dash"></i>
                                                </button>
                                                <input type="number" class="qty-input" value="${item.qty}" min="1" max="10"
                                                       data-item="1">
                                                <button class="qty-btn qty-plus" data-item="1">
                                                    <i class="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Price -->
                                        <div class="col-6 col-md-6 text-end">
                                            <div class="price-container d-none d-md-block">
                                                <div class="current-price">LKR 
                                                ${new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(item.price)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="cart-item-actions">
                                <button class="action-btn remove-btn" data-item="1" title="Remove" onclick="removeItemFromCart(${item.cartId})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Delivery Info -->
                        <div class="delivery-info">
                            <div class="row g-2">
                                <div class="col-md-6">
                                    <small class="text-muted">
                                        <i class="bi bi-truck me-1"></i>
                                        Delivery in 3-5 business days
                                    </small>
                                </div>
                                <div class="col-md-6 text-md-end">
                                    <small class="text-muted">
                                        <i class="bi bi-box-seam me-1"></i>
                                        Shipping: LKR ${shippingPerProduct.toLocaleString('en-US', {minimumFractionDigits: 2})}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;
                    });

                    // Calculate grand total
                    const grandTotal = subtotal + totalShipping;

                    // Update Order Summary
                    if (orderSummary) {
                        const subtotalText = `Subtotal (${totalQty} ${totalQty === 1 ? 'item' : 'items'})`;
                        const formattedSubtotal = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(subtotal);
                        const formattedShipping = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(totalShipping);
                        const formattedGrandTotal = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(grandTotal);

                        orderSummary.querySelector('.summary-body').innerHTML = `
                            <div class="summary-row">
                                <span>${subtotalText}</span>
                                <span>LKR ${formattedSubtotal}</span>
                            </div>
                            <div class="summary-row">
                                <span>Shipping (${data.cartItems.length} ${data.cartItems.length === 1 ? 'product' : 'products'} × LKR ${shippingPerProduct.toLocaleString('en-US', {minimumFractionDigits: 2})})</span>
                                <span class="text-success">LKR ${formattedShipping}</span>
                            </div>
                            <div class="summary-divider"></div>
                            <div class="summary-total">
                                <span>Total</span>
                                <div class="total-amount">
                                    <div class="amount">LKR ${formattedGrandTotal}</div>
                                </div>
                            </div>
                        `;
                    }
                }

            } else {
                if(data.message === "No items in cart."){
                    // return null;
                }else{
                    new Notify({
                        status: 'error',
                        title: 'Error',
                        text: data.message,
                        effect: 'fade',
                        speed: 300,
                        showIcon: true,
                        showCloseButton: true,
                        autoclose: true,
                        autotimeout: 3000,
                        notificationsGap: null,
                        notificationsPadding: null,
                        type: 'outline',
                        position: 'right top',
                    })
                }
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to load cart items. Please try again.',
                effect: 'fade',
                speed: 300,
                showIcon: true,
                showCloseButton: true,
                autoclose: true,
                autotimeout: 3000,
                notificationsGap: null,
                notificationsPadding: null,
                type: 'outline',
                position: 'right top',
            })
        }
    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            notificationsGap: null,
            notificationsPadding: null,
            type: 'outline',
            position: 'right top',
        })
    } finally {
        Notiflix.Loading.remove();
    }
}

// Load advanced search data
async function loadAdvancedSearchData() {
    try {
        const response = await fetch('api/common/all-products');
        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                updateProductView(data);
                updateCategoriesView(data.categoryList, data.allProductCount);
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to load advanced search data',
                effect: 'fade',
                speed: 300,
                showIcon: true,
                showCloseButton: true,
                autoclose: true,
                autotimeout: 3000,
                notificationsGap: null,
                notificationsPadding: null,
                type: 'outline',
                position: 'right top',
            })
        }
    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            notificationsGap: null,
            notificationsPadding: null,
            type: 'outline',
            position: 'right top',
        })
    }
}

// Update product view
let allProductsData = null; // Store all products globally for filtering

// Render products
function updateProductView(data) {
    allProductsData = data;

    const bookCount = document.getElementById('bookCount');
    bookCount.innerText = data.allProductCount;

    const productContainer = document.getElementById('productsContainer');
    let htmlContent = '';

    data.allProducts.forEach((product) => {
        product.stockDTOList.forEach((stock) => {
            let priceFormatted = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(stock.price);

            // Determine stock status - IMPORTANT: Check if stock.stock exists
            const stockQty = stock.stock || 0;
            const isInStock = stockQty > 0;
            const stockStatus = isInStock ? 'in-stock' : 'out-of-stock';

            htmlContent += `
            <div class="col-md-4 col-sm-6 product-item" 
                 data-category="${product.categoryName.toLowerCase()}"
                 data-availability="${stockStatus}">
                    <a href="single-product.html?productId=${product.productId}" class="text-decoration-none text-dark">
                        <div class="product-card">
                    <div class="product-image-container">
                        <img src="${product.images[0]}"
                             alt="${product.title}"
                             class="img-fluid">
                        <span class="product-badge bg-${product.categoryName.toLowerCase()}">${product.categoryName}</span>
                        <div class="product-actions">
                            <button class="wishlist-toggle" title="Add to Wishlist">
                                <i class="bi bi-heart"></i>
                            </button>
                            <button class="quick-view" title="Quick View">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h5 class="product-title text-truncate">${product.title}</h5>
                        <p class="product-author">${product.author}</p>
                        <div class="product-price">
                            <span class="current-price">LKR ${priceFormatted}</span>
                        </div>
                        <div class="product-stock-info mb-2">
                            <small class="${isInStock ? 'text-success' : 'text-danger'}">
                                ${isInStock ? `${stockQty} in stock` : 'Out of stock'}
                            </small>
                        </div>
                        <div class="product-actions-bottom">
                            <button class="add-to-cart" 
                                    onclick="addToCart(${stock.stockId},1)"
                                    ${!isInStock ? 'disabled' : ''}>
                                <i class="bi bi-cart-plus me-2"></i>
                                ${isInStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>     
                    </a>
               
            </div>
            `;
        });
    });

    productContainer.innerHTML = htmlContent;
}

// Render categories
function updateCategoriesView(categoryList, allProductCount) {
    const categoriesContainer = document.querySelector('.categories-list');

    let htmlContent = `
        <div class="form-check mb-2">
            <input class="form-check-input category-filter" type="checkbox" value="all"
                   id="catAll" checked onchange="filterByCategory(event)">
            <label class="form-check-label" for="catAll">
                All Categories
            </label>
            <span class="badge bg-light text-dark float-end">${allProductCount}</span>
        </div>
    `;

    categoryList.forEach(category => {
        const categoryId = `cat${category.name.replace(/\s+/g, '')}`;
        const categoryValue = category.name.toLowerCase();

        htmlContent += `
            <div class="form-check mb-2">
                <input class="form-check-input category-filter" type="checkbox" 
                       value="${categoryValue}" id="${categoryId}" onchange="filterByCategory(event)">
                <label class="form-check-label text-truncate" for="${categoryId}">
                    ${category.name}
                </label>
                <span class="badge bg-${categoryValue} text-white float-end">${category.count}</span>
            </div>
        `;
    });

    categoriesContainer.innerHTML = htmlContent;
}

// Sort products
async function sortProducts(sortBy) {
    try {
        Notiflix.Loading.dots('Sorting products...', {
            clickToClose: false,
            svgColor: '#000cf5'
        });

        // Map frontend values to backend values
        const sortMapping = {
            'popularity': 'popularity',
            'newest': 'Newest First',
            'price-low': 'Price Low to High',
            'price-high': 'price_desc',
            'rating': 'rating',
            'title': 'title'
        };

        const backendSortValue = sortMapping[sortBy] || sortBy;

        const response = await fetch(`api/common/sort-by?sortBy=${encodeURIComponent(backendSortValue)}`);

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                // Update the product view with sorted products
                updateSortedProductView(data.sortedProducts);

                // Re-apply current filters
                applyAllFilters();

                Notiflix.Loading.remove();
            } else {
                Notiflix.Loading.remove();
                new Notify({
                    status: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to sort products',
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    type: 'outline',
                    position: 'right top',
                });
            }
        } else {
            Notiflix.Loading.remove();
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to sort products',
                effect: 'fade',
                speed: 300,
                showIcon: true,
                showCloseButton: true,
                autoclose: true,
                autotimeout: 3000,
                type: 'outline',
                position: 'right top',
            });
        }
    } catch (e) {
        Notiflix.Loading.remove();
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top',
        });
    }
}

// Update product view with sorted products
function updateSortedProductView(sortedProducts) {
    // Update the global data
    if (allProductsData) {
        allProductsData.allProducts = sortedProducts;
    }

    const productContainer = document.getElementById('productsContainer');
    let htmlContent = '';

    sortedProducts.forEach((product) => {
        product.stockDTOList.forEach((stock) => {
            let priceFormatted = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(stock.price);

            const stockQty = stock.stock || 0;
            const isInStock = stockQty > 0;
            const stockStatus = isInStock ? 'in-stock' : 'out-of-stock';

            htmlContent += `
            <div class="col-md-4 col-sm-6 product-item" 
                 data-category="${product.categoryName.toLowerCase()}"
                 data-availability="${stockStatus}">
                <a href="single-product.html?productId=${product.productId}" class="text-decoration-none text-dark">
                    <div class="product-card">
                        <div class="product-image-container">
                            <img src="${product.images[0]}"
                                 alt="${product.title}"
                                 class="img-fluid">
                            <span class="product-badge bg-${product.categoryName.toLowerCase()}">${product.categoryName}</span>
                            <div class="product-actions">
                                <button class="wishlist-toggle" title="Add to Wishlist">
                                    <i class="bi bi-heart"></i>
                                </button>
                                <button class="quick-view" title="Quick View">
                                    <i class="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h5 class="product-title text-truncate">${product.title}</h5>
                            <p class="product-author">${product.author}</p>
                            <div class="product-price">
                                <span class="current-price">LKR ${priceFormatted}</span>
                            </div>
                            <div class="product-stock-info mb-2">
                                <small class="${isInStock ? 'text-success' : 'text-danger'}">
                                    ${isInStock ? `${stockQty} in stock` : 'Out of stock'}
                                </small>
                            </div>
                            <div class="product-actions-bottom">
                                <button class="add-to-cart" 
                                        onclick="addToCart(${stock.stockId},1)"
                                        ${!isInStock ? 'disabled' : ''}>
                                    <i class="bi bi-cart-plus me-2"></i>
                                    ${isInStock ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    </div>     
                </a>
            </div>
            `;
        });
    });

    productContainer.innerHTML = htmlContent;
}

// Filter functions
function filterByCategory(event) {
    const allCheckbox = document.getElementById('catAll');
    const categoryCheckboxes = document.querySelectorAll('.category-filter:not(#catAll)');
    const clickedCheckbox = event ? event.target : null;

    // If "All" was clicked
    if (clickedCheckbox && clickedCheckbox.id === 'catAll') {
        if (allCheckbox.checked) {
            // Uncheck all other categories
            categoryCheckboxes.forEach(cb => cb.checked = false);
        }
    } else if (clickedCheckbox) {
        // If any category was clicked, uncheck "All"
        if (clickedCheckbox.checked) {
            allCheckbox.checked = false;
        } else {
            // If no categories are selected, check "All"
            const anyChecked = Array.from(categoryCheckboxes).some(cb => cb.checked);
            if (!anyChecked) {
                allCheckbox.checked = true;
            }
        }
    }

    // Get selected categories
    const checkedBoxes = document.querySelectorAll('.category-filter:checked');
    const selectedCategories = Array.from(checkedBoxes).map(cb => cb.value);

    // Filter products
    const allProducts = document.querySelectorAll('.product-item');
    let visibleCount = 0;

    allProducts.forEach(product => {
        const productCategory = product.getAttribute('data-category');

        if (selectedCategories.includes('all') || selectedCategories.includes(productCategory)) {
            product.style.display = '';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });

    // Apply all filters
    applyAllFilters();
}

// Availability filter
function filterByAvailability(event) {
    const inStockCheckbox = document.getElementById('inStock');
    const outOfStockCheckbox = document.getElementById('outOfStock');

    // Prevent both from being unchecked
    const clickedCheckbox = event.target;

    // If trying to uncheck the last checked box, prevent it
    if (!clickedCheckbox.checked && !inStockCheckbox.checked && !outOfStockCheckbox.checked) {
        clickedCheckbox.checked = true;
        return;
    }

    // Apply all filters
    applyAllFilters();
}

// Apply all filters together
function applyAllFilters() {
    // Get selected categories
    const categoryCheckboxes = document.querySelectorAll('.category-filter:checked');
    const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);

    // Get selected availability
    const availabilityCheckboxes = document.querySelectorAll('.availability-filter:checked');
    const selectedAvailability = Array.from(availabilityCheckboxes).map(cb => cb.value);

    // Filter products
    const allProducts = document.querySelectorAll('.product-item');
    let visibleCount = 0;

    allProducts.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        const productAvailability = product.getAttribute('data-availability');

        // Check if product matches filters
        const categoryMatch = selectedCategories.includes('all') ||
            selectedCategories.includes(productCategory);
        const availabilityMatch = selectedAvailability.length === 0 ||
            selectedAvailability.includes(productAvailability);

        if (categoryMatch && availabilityMatch) {
            product.style.display = '';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });

    // Update book count with format: "Showing X of Y books"
    const bookCount = document.getElementById('bookCount');
    if (bookCount) {
        // Add a small fade effect
        bookCount.style.opacity = '0.5';
        setTimeout(() => {
            bookCount.innerText = visibleCount;
            bookCount.style.opacity = '1';
        }, 150);
    }
}

async function removeItemFromCart(cartId) {
    try {
        const response = await fetch(`api/common/remove-cart-item/${cartId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                new Notify({
                    status: 'success',
                    title: 'Successfully Removed',
                    text: data.message,
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    notificationsGap: null,
                    notificationsPadding: null,
                    type: 'outline',
                    position: 'right top',
                })
            } else {
                new Notify({
                    status: 'error',
                    title: 'Error',
                    text: data.message,
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    notificationsGap: null,
                    notificationsPadding: null,
                    type: 'outline',
                    position: 'right top',
                })
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to remove item from cart. Please try again.',
                effect: 'fade',
                speed: 300,
                showIcon: true,
                showCloseButton: true,
                autoclose: true,
                autotimeout: 3000,
                notificationsGap: null,
                notificationsPadding: null,
                type: 'outline',
                position: 'right top',
            })
        }
    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            notificationsGap: null,
            notificationsPadding: null,
            type: 'outline',
            position: 'right top',
        })
    }
}