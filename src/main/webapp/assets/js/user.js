window.addEventListener('load', async () => {
    Notiflix.Loading.dots("Loading...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });
    try {
        await loadUserData();
        const addAddressForm = document.getElementById('addAddressForm');
        if (addAddressForm) {
            addAddressForm.addEventListener('submit', addNewAddress);
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
            type: 'outline',
            position: 'right top',
        })
    } finally {
        Notiflix.Loading.remove(1000);
    }
});

//Initialize Bootstrap modals
const editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'));
const editAddressModal = new bootstrap.Modal(document.getElementById('editAddressModal'));

// Edit Profile Button Click Handler
document.getElementById('editProfileBtn').addEventListener('click', function () {
    // Pre-fill the modal with current values
    document.getElementById('editFirstName').value = document.getElementById('firstNameDisplay').textContent || '';
    document.getElementById('editLastName').value = document.getElementById('lastNameDisplay').textContent || '';
    document.getElementById('editEmail').value = document.getElementById('emailDisplay').textContent || '';
    document.getElementById('editPhone').value = document.getElementById('phoneDisplay').textContent || '';

    // Show the modal
    editProfileModal.show();
});

// Save Profile Changes
document.getElementById('saveProfileBtn').addEventListener('click', async function () {
    Notiflix.Loading.dots("Updating profile...", {
        clickToClose: false,
        svgColor: "#000cf5"
    });

    let firstName = document.getElementById("editFirstName").value;
    let lastName = document.getElementById("editLastName").value;
    let phone = document.getElementById("editPhone").value;

    const payload = {
        firstName: firstName,
        lastName: lastName,
        mobile: phone
    }

    try {
        const response = await fetch('api/profiles/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            if (data.status) {
                new Notify({
                    status: 'success',
                    title: 'Profile Updated',
                    text: 'Your profile has been updated successfully.',
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
                });

                setTimeout(() => {
                    window.location.reload();
                }, 3000)
            } else {
                new Notify({
                    status: 'error',
                    title: 'Update Failed',
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
                title: 'Update Failed',
                text: 'Failed to update profile. Please try again.',
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
            title: 'Update Failed',
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
});

// Edit Address Button Click Handler (using event delegation)
document.getElementById('addressList').addEventListener('click', async function (e) {
    const setDefaultBtn = e.target.closest('.set-default');
    if (setDefaultBtn) {
        const addressId = setDefaultBtn.dataset.addressId;
        setDefaultAddress(addressId);
        return;
    }

    const deleteBtn = e.target.closest('.delete-address');
    if (deleteBtn) {
        const addressId = deleteBtn.dataset.addressId;
        deleteAddress(addressId);
        return;
    }

    const editBtn = e.target.closest('.edit-address');
    if (editBtn) {
        const addressId = editBtn.dataset.addressId;
        const addressData = editBtn.dataset.address ? JSON.parse(editBtn.dataset.address) : null;

        document.getElementById('editAddressId').value = addressId;
        if (addressData) {
            await populateEditAddressForm(addressData);
        }

        editAddressModal.show();
    }
});

// Update Address Handler
document.getElementById('updateAddressBtn').addEventListener('click', async function () {
    const line1 = document.getElementById('editAddressLine1').value.trim();
    const line2 = document.getElementById('editAddressLine2').value.trim();
    const districtId = document.getElementById('editDistrictSelect').value;
    const cityId = document.getElementById('editCitySelect').value;
    const postalCode = document.getElementById('editPostalCode').value.trim();
    const mobile = document.getElementById('editMobileNumber').value.trim();

    if (!line1) {
        Notiflix.Notify.failure('Address Line 1 is required.', {position: 'right-top'});
        return;
    }
    if (!line2) {
        Notiflix.Notify.failure('Address Line 2 is required.', {position: 'right-top'});
        return;
    }
    if (districtId === "0" || !districtId) {
        Notiflix.Notify.failure('Please select a district.', {position: 'right-top'});
        return;
    }
    if (cityId === "0" || !cityId) {
        Notiflix.Notify.failure('Please select a city.', {position: 'right-top'});
        return;
    }
    if (!postalCode) {
        Notiflix.Notify.failure('Postal code is required.', {position: 'right-top'});
        return;
    }
    if (!mobile) {
        Notiflix.Notify.failure('Mobile number is required.', {position: 'right-top'});
        return;
    }

    const addressData = {
        id: parseInt(document.getElementById('editAddressId').value, 10),
        line1: line1,
        line2: line2,
        cityId: parseInt(cityId, 10),
        postalCode: postalCode,
        mobile: mobile,
        isDefault: document.getElementById('editSetAsDefault').checked
    };

    try {
        Notiflix.Loading.dots("Updating...", {svgColor: "#f5006a"});

        const response = await fetch('api/profiles/update-address', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(addressData)
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                Notiflix.Notify.success('Address updated successfully!', {position: 'right-top'});
                editAddressModal.hide();
                location.reload();
            } else {
                Notiflix.Notify.failure(data.message, {position: 'right-top'});
            }
        } else {
            Notiflix.Notify.failure('Failed to update address.', {position: 'right-top'});
        }
    } catch (e) {
        Notiflix.Notify.failure('Failed to update address', {position: 'right-top'});
    } finally {
        Notiflix.Loading.remove();
    }
});

async function loadUserData() {

    Notiflix.Loading.dots("Loading your data...", {
        clickToClose: false,
        svgColor: "#f5006a"
    });

    try {
        const response = await fetch('api/profiles/user-profile', {
            method: 'GET'
        });
        if (response.ok) {
            if (response.redirected) {
                window.location.href = response.url // Redirect to the login page
                return;
            }
            const data = await response.json();

            let replacedText = String(data.user.sinceAt).replace("-", " ");
            let since = replacedText.split(" ");

            document.getElementById("firstNameDisplay").innerText = data.user.firstName;
            document.getElementById("lastNameDisplay").innerText = data.user.lastName;
            document.getElementById("emailDisplay").innerText = data.user.email;
            document.getElementById("phoneDisplay").innerText = data.user.mobile === undefined ? '' : data.user.mobile;
            document.getElementById("mobile").innerText = data.user.mobile === undefined ? '' : data.user.mobile;
            document.getElementById("memberSinceDisplay").innerText = `Bookliy Member Since ${since[1]} ${since[0]}`
            document.getElementById("name").innerHTML = `Hello, ${data.user.firstName} ${data.user.lastName}`;
            document.getElementById("uEmail").innerHTML = data.user.email;
            document.getElementById("lineOne").innerText = data.user.lineOne === undefined ? "" : data.user.lineOne;
            document.getElementById("lineTwo").innerText = data.user.lineTwo === undefined ? "" : data.user.lineTwo;
            document.getElementById("RegName").innerHTML = `${data.user.firstName} ${data.user.lastName}`;

            // Render all addresses
            const fullName = `${data.user.firstName} ${data.user.lastName}`;

            if (data.addresses) {
                console.log("Rendering", data.addresses.length, "addresses");
                renderAddresses(data.addresses, fullName);
            } else {
                console.log("No addresses array in response!");
                renderAddresses([], fullName);  // Show empty state
            }

        } else {
            Notiflix.Notify.failure("Failed to load user data. Please try again.", {
                position: 'center-top',
            });
        }
    } catch (e) {
        Notiflix.Notify.failure(e.message, {
            position: 'center-top',
        });
    } finally {
        Notiflix.Loading.remove(1000);
    }
}

function renderAddresses(addresses, userName) {
    const addressList = document.getElementById('addressList');
    const emptyState = document.getElementById('emptyAddressState');

    // Clear existing content
    addressList.innerHTML = '';

    // Show empty state if no addresses
    if (!addresses || addresses.length === 0) {
        addressList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    addressList.style.display = 'flex';
    emptyState.style.display = 'none';

    // Loop through addresses and create cards
    addresses.forEach((address, index) => {
        const isPrimary = address.primary || address.isPrimary;

        const cardHTML = `
            <div class="col-md-6">
                <div class="address-card card ${isPrimary ? 'border-primary' : ''} h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h6 class="card-title fw-bold">${address.label || (isPrimary ? 'Primary Address' : 'Address ' + (index + 1))}</h6>
                            ${isPrimary
            ? '<span class="badge bg-primary">Default</span>'
            : `<button class="btn btn-outline-primary btn-sm set-default" data-address-id="${address.id}">Set Default</button>`
        }
                        </div>
                        <p class="card-text mb-2">
                            <strong>${userName}</strong><br>
                            ${address.lineOne || ''}<br>
                            ${address.lineTwo ? address.lineTwo + '<br>' : ''}
                            ${address.cityName || ''} ${address.postalCode || ''}
                        </p>
                        <p class="card-text">
                            <i class="bi bi-telephone me-1"></i>${address.mobile || 'No phone'}
                        </p>
                        <div class="address-actions mt-3">
                            <button class="btn btn-outline-primary btn-sm me-1 edit-address" 
                                    data-address-id="${address.id}"
                                    data-address='${JSON.stringify(address)}'>
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm delete-address" 
                                    data-address-id="${address.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        addressList.innerHTML += cardHTML;
    });
}

async function addNewAddress(event) {
    event.preventDefault();

    const line1 = document.getElementById('addressLine1').value.trim();
    const line2 = document.getElementById('addressLine2').value.trim();
    const districtId = document.getElementById('districtSelect').value;
    const cityId = document.getElementById('citySelect').value;
    const postalCode = document.getElementById('postalCode').value.trim();
    const mobile = document.getElementById('mobileNumber').value.trim();
    const isDefault = document.getElementById('setAsDefault').checked;

    // Frontend validation
    if (!line1) {
        new Notify({
            status: 'warning',
            title: 'Validation Error',
            text: 'Address Line 1 is required',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top',
        });
        return;
    }

    if (!line2) {
        new Notify({
            status: 'warning',
            title: 'Validation Error',
            text: 'Address Line 2 is required',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top',
        });
        return;
    }

    if (districtId === "0" || !districtId) {
        new Notify({
            status: 'warning',
            title: 'Validation Error',
            text: 'Please select a district',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top',
        });
        return;
    }

    if (cityId === "0" || !cityId) {
        new Notify({
            status: 'warning',
            title: 'Validation Error',
            text: 'Please select a city',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top',
        });
        return;
    }

    if (!postalCode) {
        new Notify({
            status: 'warning',
            title: 'Validation Error',
            text: 'Postal code is required',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top',
        });
        return;
    }

    if (!mobile) {
        new Notify({
            status: 'warning',
            title: 'Validation Error',
            text: 'Mobile number is required',
            effect: 'fade',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            type: 'outline',
            position: 'right top',
        });
        return;
    }

    // Prepare data - send cityId as integer
    const addressData = {
        line1: line1,
        line2: line2,
        cityId: parseInt(cityId),
        postalCode: postalCode,
        mobile: mobile,
        isDefault: isDefault
    };

    console.log("Sending address data:", addressData);

    try {
        Notiflix.Loading.dots("Adding new address...", {
            clickToClose: false,
            svgColor: "#000cf5"
        });

        const response = await fetch('api/profiles/new-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(addressData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Response:", data);

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
                    type: 'outline',
                    position: 'right top',
                });

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addAddressModal'));
                modal.hide();

                // Reset form
                document.getElementById('addAddressForm').reset();

                // Reload page after short delay
                setTimeout(() => {
                    window.location.reload();
                }, 3000);

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
                    type: 'outline',
                    position: 'right top',
                });
            }
        } else {
            new Notify({
                status: 'error',
                title: 'Error',
                text: 'Failed to add address. Please try again.',
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
        console.error("Error adding address:", e);
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
    } finally {
        Notiflix.Loading.remove();
    }
}

async function setDefaultAddress(addressId) {
    if (!addressId) {
        return;
    }

    try {
        Notiflix.Loading.dots("Updating default address...", {svgColor: "#000cf5"});

        const response = await fetch('api/profiles/default-address', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({addressId: parseInt(addressId, 10)})
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                Notiflix.Notify.success('Default address updated.', {position: 'right-top'});
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                Notiflix.Notify.failure(data.message || 'Failed to update default address.', {position: 'right-top'});
            }
        } else {
            Notiflix.Notify.failure('Failed to update default address. Please try again.', {position: 'right-top'});
        }
    } catch (e) {
        Notiflix.Notify.failure('Failed to update default address.', {position: 'right-top'});
    } finally {
        Notiflix.Loading.remove();
    }
}

async function deleteAddress(addressId) {
    if (!addressId) {
        return;
    }

    if (!window.confirm('Are you sure you want to delete this address?')) {
        return;
    }

    try {
        Notiflix.Loading.dots("Deleting address...", {svgColor: "#000cf5"});
        const response = await fetch(`api/profiles/delete-address/${addressId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status) {
                Notiflix.Notify.success('Address deleted.', {position: 'right-top'});
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                Notiflix.Notify.failure(data.message || 'Failed to delete address.', {position: 'right-top'});
            }
        } else {
            Notiflix.Notify.failure('Failed to delete address.', {position: 'right-top'});
        }
    } catch (e) {
        Notiflix.Notify.failure('Failed to delete address.', {position: 'right-top'});
    } finally {
        Notiflix.Loading.remove();
    }
}

async function populateEditAddressForm(address) {
    document.getElementById('editAddressLine1').value = address.lineOne || '';
    document.getElementById('editAddressLine2').value = address.lineTwo || '';
    document.getElementById('editPostalCode').value = address.postalCode || '';
    document.getElementById('editMobileNumber').value = address.mobile || '';
    document.getElementById('editSetAsDefault').checked = !!address.isPrimary;

    await loadEditDistricts();
    if (address.districtId) {
        document.getElementById('editDistrictSelect').value = String(address.districtId);
        await loadEditCities();
    }
    if (address.cityId) {
        document.getElementById('editCitySelect').value = String(address.cityId);
    }
}

async function loadEditDistricts() {
    const districtSelect = document.getElementById('editDistrictSelect');
    if (!districtSelect) {
        return;
    }

    const response = await fetch('api/data/districts', {method: 'GET', credentials: 'include'});
    if (!response.ok) {
        return;
    }
    const data = await response.json();
    districtSelect.innerHTML = `<option value="0">Select District</option>`;
    if (data.districts && data.districts.length > 0) {
        data.districts.forEach((district) => {
            const option = document.createElement('option');
            option.value = district.id;
            option.innerHTML = district.name;
            districtSelect.appendChild(option);
        });
    }
}

async function loadEditCities() {
    const districtSelect = document.getElementById('editDistrictSelect');
    const citySelect = document.getElementById('editCitySelect');
    if (!districtSelect || !citySelect) {
        return;
    }

    const selectedDistrictId = districtSelect.value;
    if (selectedDistrictId === "0" || !selectedDistrictId) {
        citySelect.innerHTML = `<option value="0">Select City</option>`;
        return;
    }

    const response = await fetch(`api/data/${selectedDistrictId}/cities`, {method: 'GET', credentials: 'include'});
    if (!response.ok) {
        return;
    }

    const data = await response.json();
    citySelect.innerHTML = `<option value="0">Select City</option>`;
    if (data.cities && data.cities.length > 0) {
        data.cities.forEach((city) => {
            const option = document.createElement('option');
            option.value = city.id;
            option.innerHTML = city.name;
            citySelect.appendChild(option);
        });
    }
}

const editDistrictSelect = document.getElementById('editDistrictSelect');
if (editDistrictSelect) {
    editDistrictSelect.addEventListener('change', loadEditCities);
}

