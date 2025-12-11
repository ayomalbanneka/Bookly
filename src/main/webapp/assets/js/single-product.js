let params = new URLSearchParams(window.location.search);
const productId = params.get("productId");

window.addEventListener('load', async () => {
    Notiflix.Loading.dots("Data is Loading...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });
    try {
        await loadSingleProductDetails();
        initializeQuantityControls();
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
            console.log(data)
            console.log(product)

            if (product.images && product.images.length > 0) {
                document.getElementById("image").src = product.images[0];
            }

            document.getElementById("productTitle").innerHTML = product.title;
            document.getElementById("author").innerHTML = product.author;
            document.getElementById("price").innerHTML = "LKR " + new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
            }).format(product.stockDTOList[0].price);

            document.getElementById("isbn").innerHTML = product.isbn;
            document.getElementById("category").innerHTML = product.categoryName;
            document.getElementById("pages").innerHTML = product.pages;
            document.getElementById("genre").innerHTML = product.genre;
            document.getElementById("publisher").innerHTML = product.publisher;
            document.getElementById("publishedDate").innerHTML = product.publishedDate;
            document.getElementById("language").innerHTML = product.language;
            document.getElementById("book-name").innerHTML = product.title;
            document.getElementById("description").innerHTML = product.description;

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