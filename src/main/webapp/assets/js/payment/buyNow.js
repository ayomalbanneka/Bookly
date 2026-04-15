// ─── State ───────────────────────────────────────────────────────────────────
let bnSavedAddress = null;   // populated from API
let bnDeliveryPrice = 0;     // first delivery option price
let bnUseSaved = false;      // toggle state

// ─── Modal open: load address data + populate summary ────────────────────────
document.getElementById('buy-now').addEventListener('click', async () => {
    // Must be logged in; the API will redirect if not – but give a friendlier hint:
    const qty = parseInt(document.getElementById('quantity-input').value) || 1;
    if (!currentStockId) {
        showNotify('warning', 'Product not ready. Please refresh and try again.');
        return;
    }

    populateBuyNowSummary(qty);

    // Load address/delivery data
    Notiflix.Loading.dots('Loading checkout info…', { svgColor: '#198754', clickToClose: false });
    try {
        const res = await fetch('api/payments/buy-now-address-data');
        if (res.redirected) {
            Notiflix.Loading.remove();
            Notiflix.Report.info(
                'Sign In Required',
                'Please sign in to use Buy Now.',
                'Sign In',
                () => { window.location.href = 'sign-in.html'; }
            );
            return;
        }
        if (res.ok) {
            const data = await res.json();
            if (data.status) {
                bnSavedAddress = data.userPrimaryAddress || null;
                bnDeliveryPrice = (data.deliveryTypeList && data.deliveryTypeList.length > 0)
                    ? data.deliveryTypeList[0].price : 0;
                await loadBnDistricts();
                populateBuyNowSummary(qty); // refresh with actual shipping cost
            }
        }
    } catch (e) {
        console.error('Error loading buy-now data:', e);
    } finally {
        Notiflix.Loading.remove();
    }

    // Wire up the toggle ONCE (avoid stacking listeners)
    const toggle = document.getElementById('bn-use-saved-address');
    toggle.checked = false;
    toggle.onchange = () => applyBnSavedAddress(toggle.checked);
    setBnFormEditable(true);

    // Show modal
    new bootstrap.Modal(document.getElementById('buyNowModal')).show();
});

// ─── Populate order summary card ─────────────────────────────────────────────
function populateBuyNowSummary(qty) {
    const priceEl = document.getElementById('price');
    const titleEl = document.getElementById('productTitle');
    const rawPrice = priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : 0;

    document.getElementById('bn-item-name').textContent = titleEl ? titleEl.textContent : '–';
    document.getElementById('bn-item-price').textContent = 'LKR ' + fmt(rawPrice);
    document.getElementById('bn-qty').textContent = qty;
    document.getElementById('bn-shipping').textContent = 'LKR ' + fmt(bnDeliveryPrice);
    document.getElementById('bn-total').textContent = 'LKR ' + fmt((rawPrice * qty) + bnDeliveryPrice);
}

// ─── District / City dropdowns ───────────────────────────────────────────────
async function loadBnDistricts() {
    try {
        const res = await fetch('api/data/districts');
        if (res.ok) {
            const data = await res.json();
            const sel = document.getElementById('bn-district');
            sel.innerHTML = '<option value="0">Select District</option>';
            if (data.districts) {
                data.districts.forEach(d => {
                    const opt = document.createElement('option');
                    opt.value = d.id;
                    opt.textContent = d.name;
                    sel.appendChild(opt);
                });
            }
            // Attach city-loader
            sel.onchange = () => loadBnCities(sel.value);
        }
    } catch (e) {
        console.error('Error loading districts:', e);
    }
}

async function loadBnCities(districtId) {
    const sel = document.getElementById('bn-city');
    sel.innerHTML = '<option value="0">Select City</option>';
    if (!districtId || districtId === '0') return;
    try {
        const res = await fetch(`api/data/${districtId}/cities`);
        if (res.ok) {
            const data = await res.json();
            if (data.status && data.cities) {
                data.cities.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.name;
                    sel.appendChild(opt);
                });
            }
        }
    } catch (e) {
        console.error('Error loading cities:', e);
    }
}

// ─── Saved-address toggle ─────────────────────────────────────────────────────
async function applyBnSavedAddress(useSaved) {
    bnUseSaved = useSaved;
    if (useSaved && bnSavedAddress) {
        document.getElementById('bn-first-name').value = bnSavedAddress.firstName || '';
        document.getElementById('bn-last-name').value = bnSavedAddress.lastName || '';
        document.getElementById('bn-line1').value = bnSavedAddress.lineOne || '';
        document.getElementById('bn-line2').value = bnSavedAddress.lineTwo || '';
        document.getElementById('bn-postal').value = bnSavedAddress.postalCode || '';
        document.getElementById('bn-mobile').value = bnSavedAddress.mobile || '';

        // Set district, wait for cities, then set city
        const distSel = document.getElementById('bn-district');
        if (bnSavedAddress.districtDTO) {
            distSel.value = bnSavedAddress.districtDTO.id;
            await loadBnCities(bnSavedAddress.districtDTO.id);
        }
        if (bnSavedAddress.cityDTO) {
            document.getElementById('bn-city').value = bnSavedAddress.cityDTO.id;
        }
        setBnFormEditable(false);
    } else {
        clearBnForm();
        setBnFormEditable(true);
    }
}

function clearBnForm() {
    ['bn-first-name','bn-last-name','bn-line1','bn-line2','bn-postal','bn-mobile'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('bn-district').value = '0';
    document.getElementById('bn-city').innerHTML = '<option value="0">Select City</option>';
}

function setBnFormEditable(editable) {
    ['bn-first-name','bn-last-name','bn-district','bn-city','bn-line1','bn-line2','bn-postal','bn-mobile']
        .forEach(id => { document.getElementById(id).disabled = !editable; });
}

// ─── Process Buy Now (send to backend, launch PayHere) ────────────────────────
async function processBuyNow() {
    const qty = parseInt(document.getElementById('quantity-input').value) || 1;
    const useSaved = document.getElementById('bn-use-saved-address').checked;

    const payload = {
        stockId: currentStockId,
        qty: qty,
        isCurrentAddress: useSaved,
        firstName: document.getElementById('bn-first-name').value,
        lastName: document.getElementById('bn-last-name').value,
        cityId: parseInt(document.getElementById('bn-city').value) || 0,
        lineOne: document.getElementById('bn-line1').value,
        lineTwo: document.getElementById('bn-line2').value,
        postalCode: document.getElementById('bn-postal').value,
        mobile: document.getElementById('bn-mobile').value
    };

    Notiflix.Loading.dots('Preparing payment…', { svgColor: '#198754', clickToClose: false });

    try {
        const res = await fetch('api/payments/buy-now', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.redirected) {
            Notiflix.Loading.remove();
            Notiflix.Report.info('Sign In Required', 'Please sign in to complete your purchase.', 'Sign In',
                () => { window.location.href = 'sign-in.html'; });
            return;
        }

        if (res.ok) {
            const data = await res.json();
            if (data.status) {
                // Close modal before opening PayHere popup
                bootstrap.Modal.getInstance(document.getElementById('buyNowModal'))?.hide();
                Notiflix.Loading.remove();
                payhere.startPayment(data.paymentDetails);
            } else {
                Notiflix.Loading.remove();
                showNotify('error', data.message || 'Buy Now failed. Please try again.');
            }
        } else {
            Notiflix.Loading.remove();
            showNotify('error', 'Server error. Please try again later.');
        }
    } catch (e) {
        Notiflix.Loading.remove();
        showNotify('error', e.message || 'Unexpected error.');
        console.error('Buy Now error:', e);
    }
}

// ─── PayHere callbacks ────────────────────────────────────────────────────────
payhere.onCompleted = async function onCompleted(orderId) {
    console.log('Buy Now payment completed. OrderID:', orderId);
    Notiflix.Loading.dots('Confirming your order…', { svgColor: '#198754', clickToClose: false });
    try {
        const res = await fetch(`api/payments/buy-now-complete?orderId=${orderId}`, { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            if (data.status) {
                window.location.href = `invoice.html?orderId=${orderId}`;
            } else {
                Notiflix.Loading.remove();
                showNotify('error', data.message || 'Failed to confirm order.');
            }
        } else {
            Notiflix.Loading.remove();
            showNotify('error', 'Failed to confirm order. Contact support.');
        }
    } catch (e) {
        Notiflix.Loading.remove();
        showNotify('error', e.message);
    }
};

payhere.onDismissed = function onDismissed() {
    console.log('Buy Now payment dismissed.');
    Notiflix.Loading.remove();
    showNotify('warning', 'Payment was cancelled. Your order has not been placed.');
};

payhere.onError = function onError(error) {
    console.error('PayHere error:', error);
    Notiflix.Loading.remove();
    showNotify('error', 'Payment error: ' + error);
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n) {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(n || 0);
}

function showNotify(status, text) {
    new Notify({
        status,
        title: status === 'error' ? 'Error' : status === 'warning' ? 'Warning' : 'Success',
        text,
        effect: 'fade',
        speed: 300,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 4000,
        type: 'outline',
        position: 'right top'
    });
}