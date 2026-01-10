const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");

window.addEventListener("load", async () => {
    if (orderId) {
        await loadInvoiceData(orderId);
    }
});

async function loadInvoiceData(orderId) {
    try {
        Notiflix.Loading.pulse("Wait...", {
            clickToClose: false,
            svgColor: '#0026ff'
        });

        const response = await fetch(`api/invoices/user-invoices?orderId=${orderId}`);
        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                console.log(data);
                const invoice = data.invoiceData;
                populateInvoiceData(invoice);
            }
        } else {
            new Notify({
                status: 'failure',
                title: 'Error',
                text: 'Failed to load invoice data.',
                position: 'center-top',
                effect: 'fade',
                speed: 300,
                customClass: null,
                customIcon: null,
                showCloseButton: false,
                rtl: false,
                timeout: 3000
            });
        }
    } catch (e) {
        new Notify({
            status: 'failure',
            title: 'API Error',
            text: e.message,
            position: 'center-top',
            effect: 'fade',
            speed: 300,
            customClass: null,
            customIcon: null,
            showCloseButton: false,
            rtl: false,
            timeout: 3000
        });
    } finally {
        Notiflix.Loading.remove();
    }
}

function populateInvoiceData(invoice) {
    // Invoice header information
    document.getElementById('invoice-id').textContent = `#${invoice.invoiceNo}`;
    document.getElementById('order-id').textContent = orderId;

    // Dates
    document.getElementById('issue-date').textContent = invoice.invoiceDate;
    document.getElementById('due-date').textContent = invoice.invoiceDate;
    document.getElementById('paid-date').textContent = `Paid on ${invoice.invoiceDate}`;

    // Buyer/Shipping information
    document.getElementById('buyer-name').textContent = invoice.buyerName;
    document.getElementById('buyer-email').textContent = invoice.email;
    document.getElementById('buyer-mobile').textContent = invoice.mobile || '+94 77 123 4567';
    document.getElementById('buyer-address').textContent = invoice.address;
    document.getElementById('city-name').textContent = invoice.cityName;
    document.getElementById('district-name').textContent = invoice.districtName || invoice.cityName;
    document.getElementById('country-name').textContent = invoice.countryName;

    // Populate order items
    const tbody = document.querySelector('.order-items tbody');
    tbody.innerHTML = ''; // Clear existing items

    let subtotal = 0;
    invoice.invoiceItemDTOList.forEach((item, index) => {
        const itemTotal = item.itemPrice * item.itemQty;
        subtotal += itemTotal;

        const categoryClass = getCategoryClass(item.categoryName);
        const imagePath = item.images && item.images.length > 0 ? item.images[0] : 'assets/images/placeholder.jpg';

        const row = `
            <tr>
                <td class="align-middle">${index + 1}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="product-image me-3">
                            <img src="${imagePath}"
                                 alt="${item.itemName}"
                                 class="rounded"
                                 width="50"
                                 height="65"
                            >
                        </div>
                        <div>
                            <h6 class="mb-1 fw-bold">${item.itemName}</h6>
                            <p class="text-muted small mb-0">${item.authors}</p>
                        </div>
                    </div>
                </td>
                <td class="align-middle text-center">
                    <span class="badge ${categoryClass}">${item.categoryName}</span>
                </td>
                <td class="align-middle text-center">
                    <span class="fw-bold">${item.itemQty}</span>
                </td>
                <td class="align-middle text-center">
                    <span class="fw-bold">LKR ${item.itemPrice.toLocaleString()}</span>
                </td>
                <td class="align-middle text-end">
                    <span class="fw-bold text-primary">LKR ${itemTotal.toLocaleString()}</span>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    // Calculate totals
    const shipping = invoice.shippingCharges;
    const total = subtotal + shipping;

    // Update summary
    const itemCount = invoice.invoiceItemDTOList.reduce((sum, item) => sum + item.itemQty, 0);
    document.getElementById('count').textContent = `Subtotal (${itemCount} items)`;
    document.getElementById('subtottal').textContent = `LKR ${subtotal.toLocaleString()}`;
    document.getElementById('shipping').textContent = `LKR ${shipping.toLocaleString()}`;
    document.getElementById('total-amount').textContent = `LKR ${total.toLocaleString()}`;
}

function getCategoryClass(categoryName) {
    const categoryMap = {
        'Fiction': 'bg-fiction',
        'Romance': 'bg-romance',
        'Mystery': 'bg-mystery',
        'Sci-Fi': 'bg-sci-fi',
        'Self-Help': 'bg-self-help',
        'Biography': 'bg-biography',
        'Business': 'bg-business',
        'Children': 'bg-children'
    };

    return categoryMap[categoryName] || 'bg-primary';
}

// Print functionality
document.getElementById('printInvoice')?.addEventListener('click', () => {
    window.print();
});

// Download PDF functionality
document.getElementById('downloadInvoice')?.addEventListener('click', () => {
    window.print();
});