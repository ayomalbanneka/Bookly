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

    } catch (e) {
        console.log("Error loading initial data:", e);
    } finally {
        Notiflix.Loading.remove(3000);
    }
})

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

function renderDropDowns(selector, list, suffix) {
    selector.innerHTML = `<option value="0">Select</option>`; // Clear existing options first!
    list.forEach((item) => {
        const option = document.createElement("option"); // Create a new option element
        option.value = item.id;
        option.innerHTML = item[suffix]; // Set the display text
        selector.appendChild(option); // Append the option to the select element
    })
}

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

async function loadCartItems() {
    try {
        Notiflix.Loading.dots('Loading cart items...', {
            clickToClose: false,
            svgColor: '#000cf5'
        });

        const response = await fetch('api/common/get-cart-items');
        if (response.ok) {
            let data = await response.json();
            console.log(data)

            const cartItemsContainer = document.getElementById('cartItemsContainer');
            const orderSummary = document.getElementById('orderSummary');

            const emptyCartDesign = document.getElementById('emptyCart');

            if (data.cartItems == null) {
                emptyCartDesign.classList.remove('d-none'); // Show empty cart
                cartItemsContainer.style.display = 'none';
                orderSummary.style.display = 'none';
            } else {
                emptyCartDesign.classList.add('d-none'); // Hide empty cart
                cartItemsContainer.style.display = 'block';
                orderSummary.style.display = 'block';
            }

            if (data.status) {
                console.log(data);

                if (cartItemsContainer) {
                    cartItemsContainer.innerHTML = ''; // Clear existing items

                    let total = 0;
                    let totalQty = 0;

                    data.cartItems.forEach((item) => {
                        let itemsTotal = parseFloat(item.price) * parseInt(item.qty);
                        total += itemsTotal;
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
                                        <!--                                        <span class="original-price">$19.99</span>-->
                                        <!--                                        <span class="discount-badge">25% OFF</span>-->
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
                                                <!--                                                <div class="original-price">$19.99</div>-->
                                                <!--                                                <div class="discount-badge">25% OFF</div>-->
                                            </div>
                                            <div class="item-total d-md-none">
                                                <strong>$14.99</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="cart-item-actions">
                                <button class="action-btn remove-btn" data-item="1" title="Remove">
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
                                    <small class="text-success">
                                        <i class="bi bi-patch-check me-1"></i>
                                        Free shipping eligible
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                        `;
                    });

                    // Update Order Summary
                    if (orderSummary) {
                        const subtotalText = `Subtotal (${totalQty} ${totalQty === 1 ? 'item' : 'items'})`;
                        const formattedTotal = new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(total);

                        orderSummary.querySelector('.summary-body').innerHTML = `
                            <div class="summary-row">
                                <span>${subtotalText}</span>
                                <span>LKR ${formattedTotal}</span>
                            </div>
                            <div class="summary-row">
                                <span>Shipping</span>
                                <span class="text-success">FREE</span>
                            </div>
                            <div class="summary-divider"></div>
                            <div class="summary-total">
                                <span>Total</span>
                                <div class="total-amount">
                                    <div class="amount">LKR ${formattedTotal}</div>
                                </div>
                            </div>
                        `;
                    }
                }

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
