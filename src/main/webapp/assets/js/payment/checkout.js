window.addEventListener('load', async () => {
    try {
        Notiflix.Loading.dots('Loading checkout page...', {
            svgColor: '#0026ff',
            clickToClose: false
        })
        await loadCheckoutDistricts(); // Load districts on page load
        await loadCheckoutData(); // Load user checkout data on page load
        document.getElementById('districtSelect').addEventListener('change', loadCheckoutCities); // Load cities when district changes

        // Add event listener to hide error when checkbox is checked
        document.getElementById('acceptTerms').addEventListener('change', function () {
            let termsNotify = document.getElementById('acceptTermsNotify');
            if (this.checked) {
                termsNotify.style.display = 'none';
            }
        });

    } catch (e) {
        new Notify({
            status: 'error',
            title: 'Error',
            text: e.message,
            effect: 'fade',
            speed: 300,
            position: 'center top',
            customClass: null,
            customIcon: null,
            showCloseButton: true,
            autoclose: false,
            gap: 20
        })
    } finally {
        Notiflix.Loading.remove();
    }
})

// Load cities based on selected district
async function loadCheckoutCities() {
    const district = document.getElementById('districtSelect');
    const selectedDistrict = district.value;

    console.log("Selected District ID:", selectedDistrict);

    // Don't load cities if no district is selected
    if (selectedDistrict === "0" || !selectedDistrict) {
        const citySelect = document.getElementById('citySelect');
        citySelect.innerHTML = '<option value="0">Select</option>';
        return;
    }

    Notiflix.Loading.dots("Your city loading now...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });

    try {
        const response = await fetch(`api/data/${selectedDistrict}/cities`, {
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
async function loadCheckoutDistricts() {
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

async function loadCheckoutData() {
    try {
        const response = await fetch('api/payments/user-checkout-data');

        if (response.redirected) {
            Notiflix.Report.info(
                'Sign In Required',
                'You need to sign in to access the checkout page.',
                'OK',
                () => {
                    window.location.href = "sign-in.html";
                }
            );
        }

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                fillUserCurrentAddress(data.userPrimaryAddress);
                makeOrderSummary(data);
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
                text: 'Failed to load checkout data. Please try again.',
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

function fillUserCurrentAddress(address) {
    console.log(address)
    const currentAddressTick = document.getElementById('showPrimaryAddress');
    currentAddressTick.addEventListener('change', async () => {
        let firstName = document.getElementById('firstName');
        let lastName = document.getElementById('lastName');
        let emailAddress = document.getElementById('email');
        let city = document.getElementById('citySelect');
        let district = document.getElementById('districtSelect');
        let line1 = document.getElementById('line-one');
        let line2 = document.getElementById('line-two');
        let postalCode = document.getElementById('postalCode');
        let phoneNumber = document.getElementById('mobile');

        if (currentAddressTick.checked) {
            firstName.value = address.firstName;
            lastName.value = address.lastName;
            emailAddress.value = address.email;
            line1.value = address.lineOne;
            line2.value = address.lineTwo;
            postalCode.value = address.postalCode;
            phoneNumber.value = address.mobile;

            // Set district first
            district.value = address.districtDTO.id;

            // Trigger the change event to load cities
            district.dispatchEvent(new Event('change'));

            // Wait for cities to load, then set city
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms for cities to load
            city.value = address.cityDTO.id;

            // Disable all fields
            firstName.disabled = true;
            lastName.disabled = true;
            emailAddress.disabled = true;
            city.disabled = true;
            district.disabled = true;
            line1.disabled = true;
            line2.disabled = true;
            postalCode.disabled = true;
            phoneNumber.disabled = true;
        } else {
            firstName.value = '';
            lastName.value = '';
            emailAddress.value = '';
            city.value = 0;
            district.value = 0;
            line1.value = '';
            line2.value = '';
            postalCode.value = '';
            phoneNumber.value = '';
            city.disabled = false;
            city.dispatchEvent(new Event('change'));

            // Enable all fields
            firstName.disabled = false;
            lastName.disabled = false;
            emailAddress.disabled = false;
            city.disabled = false;
            district.disabled = false;
            line1.disabled = false;
            line2.disabled = false;
            postalCode.disabled = false;
            phoneNumber.disabled = false;
        }
    })
}

function renderDropDowns(selector, list, suffix) {
    selector.innerHTML = `<option value="0">Select </option>`; // Clear existing options first!
    list.forEach((item) => {
        const option = document.createElement("option"); // Create a new option element
        option.value = item.id;
        option.innerHTML = item[suffix]; // Set the display text
        selector.appendChild(option); // Append the option to the select element
    })
}

function makeOrderSummary(data) {
    console.log(data);

    const cartList = data.cartList;
    const deliveryTypeList = data.deliveryTypeList;

    // Get elements by ID
    let orderItemsContainer = document.querySelector('.order-items');
    let itemCountElement = document.getElementById('items');
    let subtotalElement = document.getElementById('subtotal');
    let shippingElement = document.getElementById('shipping');
    let totalElement = document.getElementById('total');

    // Update item count
    itemCountElement.textContent = `Order Items (${cartList.length})`;

    // Clear existing items
    let existingItems = orderItemsContainer.querySelectorAll('.order-item');
    existingItems.forEach(item => item.remove());

    let subtotal = 0;
    let totalQty = 0;

    // Add each cart item and calculate subtotal
    cartList.forEach((item) => {
        let itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        totalQty += item.qty;
    });

    // Update subtotal
    subtotalElement.textContent = `LKR ${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

    // Calculate shipping once per order
    const shippingCost = deliveryTypeList.length > 0 ? deliveryTypeList[0].price : 0;

    // Update shipping
    shippingElement.textContent = `LKR ${shippingCost.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

    // Calculate and update total
    let grandTotal = subtotal + shippingCost;
    totalElement.textContent = `LKR ${grandTotal.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

}

async function checkout() {

    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let emailAddress = document.getElementById('email');
    let city = document.getElementById('citySelect');
    let district = document.getElementById('districtSelect');
    let line1 = document.getElementById('line-one');
    let line2 = document.getElementById('line-two');
    let postalCode = document.getElementById('postalCode');
    let phoneNumber = document.getElementById('mobile');
    let termsCheckbox = document.getElementById('acceptTerms');
    let termsNotify = document.getElementById('acceptTermsNotify');

    // Check if terms are accepted
    if (!termsCheckbox.checked) {
        termsNotify.style.display = 'block';
        termsCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });

        new Notify({
            status: 'error',
            title: 'Terms Required',
            text: 'Please accept the Terms & Conditions to continue',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            position: 'right top',
        });

        return;
    }

    // Hide error message if showing
    termsNotify.style.display = 'none';

    const userData = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: emailAddress.value,
        cityId: city.value,
        districtId: district.value,
        lineOne: line1.value,
        lineTwo: line2.value,
        postalCode: postalCode.value,
        mobile: phoneNumber.value
    }

    const userDataJson = JSON.stringify(userData);

    try {
        Notiflix.Loading.dots('Processing your order...', {
            svgColor: '#0026ff',
            clickToClose: false
        });

        const response = await fetch('api/payments/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userDataJson
        });

        if(response.ok){
            const data = await response.json();
            if(data.status){
                console.log(data);
                payhere.startPayment(data.paymentDetails);
            } else {
                new Notify({
                    status: 'error',
                    title: 'Error',
                    text: data.message || 'Checkout failed',
                    effect: 'fade',
                    speed: 300,
                    showIcon: true,
                    showCloseButton: true,
                    autoclose: true,
                    autotimeout: 3000,
                    position: 'right top',
                });
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to process checkout. Please try again.',
                effect: 'fade',
                speed: 300,
                showIcon: true,
                showCloseButton: true,
                autoclose: true,
                autotimeout: 3000,
                position: 'right top',
            });
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
            position: 'right top',
        });
    } finally {
        Notiflix.Loading.remove();
    }
}

payhere.onCompleted = async function onCompleted(orderId) {
    console.log("Payment completed. OrderID:" + orderId);
    await verifyOrder(orderId);
    // Note: validate the payment and show success or failure page to the customer
};

// Payment window closed
payhere.onDismissed = function onDismissed() {
    // Note: Prompt user to pay again or show an error page
    console.log("Payment dismissed");
    Notiflix.Loading.remove();
};

// Error occurred
payhere.onError = function onError(error) {
    // Note: show an error page
    console.log("Error:"  + error);
};

async function verifyOrder(orderId) {
    try {
        const response = await fetch(`api/orders/verify-order?orderId=${orderId}`);
        if (response.ok) {
            const data = await response.json();
            if(data.status){
                window.location = `invoice.html?orderId=${orderId}`;
            }else{
                //redirect to fail page
            }
        } else {
            Notiflix.Notify.failure('Failed to verify order.', {
                position: 'center-top'
            });
        }
    } catch (e) {
        Notiflix.Notify.failure(e.message, {
            position: 'center-top'
        });
    }
}