let params = new URLSearchParams(window.location.search);
const productId = params.get("productId");
let currentStockId = null;

window.addEventListener('load', async () => {
    Notiflix.Loading.dots("Data is Loading...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });
    try {
        await loadSingleProductDetails();
        await loadRelatedProducts();
        initializeQuantityControls();
        initializeWishlistButton();
    } catch (e) {
        console.log("Error loading initial data:", e);
    } finally {
        Notiflix.Loading.remove(3000);
    }
})

async function loadSingleProductDetails() {

    try {
        const response = await fetch(`api/common/single-product?productId=${productId}`);
        console.log(response)
        if (response.ok) {
            const data = await response.json();
            const product = data.singleProduct;

            if (product.images && product.images.length > 0) {
                document.getElementById("image").src = product.images[0];
            }

            document.getElementById('bookNameOnTittle').innerHTML = product.title + " | Bookly";
            document.getElementById("productTitle").innerHTML = product.title;
            document.getElementById("author").innerHTML = product.author;
            document.getElementById("price").innerHTML = "LKR " + new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
            }).format(product.stockDTOList[0].price);

            document.getElementById("isbn").innerHTML = product.isbn;
            document.getElementById("category").innerHTML = product.categoryName;
            document.getElementById("category").href = product.categoryName.toLowerCase() + ".html";
            document.getElementById("pages").innerHTML = product.pages;
            document.getElementById("genre").innerHTML = product.genre;
            document.getElementById("publisher").innerHTML = product.publisher;
            document.getElementById("publishedDate").innerHTML = product.publishedDate;
            document.getElementById("language").innerHTML = product.language;
            document.getElementById("book-name").innerHTML = product.title;
            document.getElementById("description").innerHTML = product.description;

            // Store stockId for wishlist
            currentStockId = product.stockDTOList[0].stockId;

            // Check if product is in wishlist
            await checkWishlistStatus(currentStockId);

            const addToCartBtn = document.getElementById('add-to-cart');
            addToCartBtn.addEventListener('click', async (evt) => {
                const qtyInput = document.getElementById('quantity-input');
                await addToCart(product.stockDTOList[0].stockId, qtyInput.value);
                evt.preventDefault();
            });

            // Set quantity input VALUE, not innerHTML
            const qtyInput = document.getElementById("quantity-input");
            if (qtyInput) {
                if (product.stockDTOList[0].stock === 0) {
                    qtyInput.value = 0;
                } else {
                    qtyInput.value = 1; // Default to 1
                }
                qtyInput.max = product.stockDTOList[0].stock; // Set max to available stock
            }

            const stockBadge = document.querySelector('.badge.bg-success');

            if (product.stockDTOList[0].stock > 0) {
                stockBadge.classList.remove('bg-danger');
                stockBadge.classList.add('bg-success');
                stockBadge.innerHTML = "In Stock";
            } else {
                document.getElementById('add-to-cart').disabled = true;
                document.getElementById('buy-now').disabled = true;
                stockBadge.classList.remove('bg-success');
                stockBadge.classList.add('bg-danger');
                stockBadge.innerHTML = "Out of Stock";
            }


        } else {
            console.error("Failed to load product details");
        }
    } catch (e) {
        console.log("Error fetching product details:", e);
    }
}

async function loadRelatedProducts() {
    try {
        const response = await fetch(`api/common/related-products?productId=${productId}`);
        if (response.ok) {
            const data = await response.json();
            console.log(data);

            const relatedProductsMain = document.getElementById("related-products-section");
            const productTemplate = document.getElementById('related-product-template');
            relatedProductsMain.innerHTML = "";

            data.relatedProducts.forEach((product) => {
                product.stockDTOList.forEach((stock) => {
                    const productClone = productTemplate.content.cloneNode(true);

                    // Product link
                    productClone.querySelector(".r-product-link").href = "single-product.html?productId=" + product.productId;

                    // Set the image
                    productClone.querySelector(".r-image").src = product.images[0];
                    productClone.querySelector(".r-image").alt = product.title;

                    // Set the title
                    productClone.querySelector(".r-title").textContent = product.title;

                    // Set the author (if you have it in your data)
                    productClone.querySelector(".r-author").textContent = product.author;

                    // Set the price
                    productClone.querySelector(".r-price").textContent = "LKR " + new Intl.NumberFormat("en-US", {
                        minimumFractionDigits: 2,
                    }).format(stock.price);

                    relatedProductsMain.appendChild(productClone);
                });
            });
        } else {
            console.error("Failed to load related products");
        }
    } catch (e) {
        console.error("Error fetching related products:", e);
    }
}

function initializeQuantityControls() {
    // Decrease quantity
    document.getElementById('decrease-qty').addEventListener('click', function () {
        const qtyInput = document.getElementById('quantity-input');
        const currentValue = parseInt(qtyInput.value);
        const minValue = parseInt(qtyInput.min);

        if (currentValue > minValue) {
            qtyInput.value = currentValue - 1;
        }
    });

    // Increase quantity
    document.getElementById('increase-qty').addEventListener('click', function () {
        const qtyInput = document.getElementById('quantity-input');
        const currentValue = parseInt(qtyInput.value);
        const maxValue = parseInt(qtyInput.max);

        if (currentValue < maxValue) {
            qtyInput.value = currentValue + 1;
        } else {
            // Optional: Show message when max is reached
            console.log('Maximum quantity reached');
        }
    });

    // Validate manual input
    document.getElementById('quantity-input').addEventListener('change', function () {
        const qtyInput = this;
        const value = parseInt(qtyInput.value);
        const minValue = parseInt(qtyInput.min);
        const maxValue = parseInt(qtyInput.max);

        if (value < minValue) {
            qtyInput.value = minValue;
        } else if (value > maxValue) {
            qtyInput.value = maxValue;
        } else if (isNaN(value)) {
            qtyInput.value = minValue;
        }
    });
}

// Initialize wishlist button
function initializeWishlistButton() {
    const wishlistBtn = document.getElementById('add-to-wishlist');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', async () => {
            await toggleWishlist();
        });
    }
}

// Check if product is in wishlist
async function checkWishlistStatus(stockId) {
    try {
        const response = await fetch(`api/wishlist/check?stockId=${stockId}`);
        if (response.ok) {
            const data = await response.json();
            updateWishlistButton(data.inWishlist);
        }
    } catch (e) {
        console.log("Error checking wishlist status:", e);
    }
}

// Toggle wishlist (add/remove)
async function toggleWishlist() {
    if (!currentStockId) {
        new Notify({
            status: 'warning',
            title: 'Warning',
            text: 'Product not loaded. Please refresh the page.',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top'
        });
        return;
    }

    try {
        const response = await fetch(`api/wishlist/add?stockId=${currentStockId}`);
        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                updateWishlistButton(true);
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
                    type: 'outline',
                    position: 'right top'
                });
            } else {
                new Notify({
                    status: 'warning',
                    title: 'Info',
                    text: data.message,
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    type: 'outline',
                    position: 'right top'
                });
            }
        }
    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: 'Failed to add to wishlist. Please login first.',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top'
        });
        console.log("Error adding to wishlist:", e);
    }
}

// Update wishlist button appearance
function updateWishlistButton(isInWishlist) {
    const wishlistBtn = document.getElementById('add-to-wishlist');
    if (wishlistBtn) {
        if (isInWishlist) {
            wishlistBtn.innerHTML = '<i class="bi bi-heart-fill me-2"></i> In Wishlist';
            wishlistBtn.classList.remove('btn-outline-primary');
            wishlistBtn.classList.add('btn-danger');
        } else {
            wishlistBtn.innerHTML = '<i class="bi bi-heart me-2"></i> Wishlist';
            wishlistBtn.classList.remove('btn-danger');
            wishlistBtn.classList.add('btn-outline-primary');
        }
    }
}
